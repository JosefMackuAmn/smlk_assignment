import fetch, { Response } from "node-fetch";

import { elastic } from "../../elastic";
import { Queue } from "../../datasctructures/Queue";

import { NotFoundError } from "../../errors/NotFoundError";
import { UnprocessableEntityError } from "../../errors/UnprocessableEntityError";
import { ThirdPartyServiceError } from "../../errors/ThirdPartyServiceError";

import { Item } from "../../models/Item";
import { CollectionItem } from "../../models/CollectionItem";
import { ItemHierarchy } from "../../models/ItemHierarchy";

import { FetchedItem, ItemInstance, ItemTypesEnum } from "../../types/models/item";
import { HACKER_NEWS_API } from "../../constants";
import { sequelize } from "../../connection";


const fetchStory = async (itemId: number, collectionId: number) => {
    const itemsToFetchQueue = new Queue<number>();

    // True for itemId / the first item to be fetched
    let firstLevel = true;

    // Error potentially occuring during the first level fetch.
    // Errors during subsequent fetches
    // are ignored in the listener function below.
    let fetchingError: any = null;

    // Register onEnqueue listener
    itemsToFetchQueue.onEnqueue = async () => {
        const currentItemId = itemsToFetchQueue.dequeue();
        const currentFirstLevel = firstLevel;
        firstLevel = false;

        // Try-catch block for transaction
        // if any error is thrown
        // the transaction will rollback
        try {
            // Create transaction
            await sequelize.transaction(async (transaction) => {
                // Fetch the item
                let itemData: Response;
                try {
                    itemData = await fetch(`${HACKER_NEWS_API}/item/${currentItemId}.json`);
                } catch (err) {
                    if (currentFirstLevel) fetchingError = err;
                    return;
                }
                if (!itemData || !itemData.ok) {
                    if (currentFirstLevel) fetchingError = new NotFoundError();            
                    return;
                };
                
                // Get the item object
                const fetchedItem = await itemData.json() as FetchedItem;
                if (!fetchedItem) {
                    if (currentFirstLevel) fetchingError = new NotFoundError();            
                    return;
                };
            
                // Check the item type for 'story' (or 'comment')
                if (
                    (currentFirstLevel && fetchedItem.type !== ItemTypesEnum.story) ||
                    !(fetchedItem.type in ItemTypesEnum)
                ) {
                    if (currentFirstLevel) fetchingError = new UnprocessableEntityError();            
                    return;
                };
            
                // Check for item existence in DB
                // save the item if doesn't exist yet
                // update the item if exists
                let item = await Item.findByPk(fetchedItem.id);
                if (!item) {
                    item = await Item.create({
                        itemId: fetchedItem.id,
                        ...fetchedItem
                    }, { transaction });
                } else {
                    await item.update({
                        ...fetchedItem
                    }, { transaction });
                }
            
                // Create association for only 'story'
                if (currentFirstLevel) {
                    const collectionItemRecord = await CollectionItem.findOne({
                        where: {
                            collectionId: collectionId,
                            itemId: item.itemId
                        }
                    });
                    if (!collectionItemRecord) {
                        await CollectionItem.create({
                            collectionId: collectionId,
                            itemId: item.itemId
                        }, { transaction });
                    }
                }
            
                // Create hierarchy record
                const parentId = fetchedItem.parent || null;
                const itemHierarchyRecord = await ItemHierarchy.findOne({
                    where: {
                        itemId: item.itemId,
                        parentId: parentId
                    }
                });
                if (!itemHierarchyRecord) {
                    await ItemHierarchy.create({
                        itemId: item.itemId,
                        parentId: parentId
                    }, { transaction });
                }
            
                // Try to save the item into the es
                try {
                    await elastic.addItem({
                        type: item.type,
                        text: item.text || '',
                        author: item.by || '',
                        title: item.title || ''
                    });
                } catch (err) {
                    console.log(`Couldn't save item ${item.itemId} into elasticsearch`);
                    throw err;
                }
            
                // Enqueue kid elements for fetching
                fetchedItem.kids?.forEach(kid => {
                    itemsToFetchQueue.enqueue(kid);
                });
            });
        } catch (err) {
            console.log(err);
        }
    };
    
    // Start fetching process by enqueuing the first itemId
    itemsToFetchQueue.enqueue(itemId);

    // Await for the whole item tree to be fetched
    await itemsToFetchQueue.listenersDone;

    // If any error occured, throw it
    if (fetchingError) throw fetchingError;

    return;
}

export { fetchStory };