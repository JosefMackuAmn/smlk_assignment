import fetch from "node-fetch";
import { Transaction } from "sequelize/types";

import { HACKER_NEWS_API } from "../../constants";
import { sequelize } from "../../sequelize";
import { elastic } from "../../elastic";

import { Logger } from "../classes/Logger";
import { Queue } from "../../datasctructures/Queue";

import { NotFoundError } from "../../errors/NotFoundError";
import { UnprocessableEntityError } from "../../errors/UnprocessableEntityError";
import { ThirdPartyServiceError } from "../../errors/ThirdPartyServiceError";
import { CustomError } from "../../errors/CustomError";

import { Item } from "../../models/Item";
import { CollectionItem } from "../../models/CollectionItem";
import { ItemHierarchy } from "../../models/ItemHierarchy";

import { FetchedItem, ItemTypesEnum } from "../../types/models/item";

// Fetch story and its kids
const fetchStory = async (itemId: number, collectionId?: number) => {
    const itemsToFetchQueue = new Queue<number>();

    // True for itemId / the first item to be fetched
    let firstLevel = true;

    // Expected error potentially occuring during the first level fetch
    // or an unexpected (ThirdPartyServiceError) error.
    // Expected errors during subsequent fetches
    // are ignored in the listener function below.
    let fetchingError: CustomError|null = null;

    // Sequelize transaction
    let transaction: Transaction;

    // Register onEnqueue listener fetching enqueued item
    itemsToFetchQueue.onEnqueue = async () => {
        const currentItemId = itemsToFetchQueue.dequeue();
        const currentFirstLevel = firstLevel;
        firstLevel = false;

        // Try-catch block for 
        // any unexpected error
        try {
            // Fetch the item
            let itemData = await fetch(`${HACKER_NEWS_API}/item/${currentItemId}.json`);
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
        
            // Create association with collection
            if (collectionId) {
                await CollectionItem.findOrCreate({
                    where: {
                        collectionId: collectionId,
                        itemId: item.itemId
                    },
                    transaction: transaction
                });
            }
        
            // Create hierarchy record
            const parentId = fetchedItem.parent || null;
            await ItemHierarchy.findOrCreate({
                where: {
                    itemId: item.itemId,
                    parentId: parentId
                },
                transaction: transaction
            });
        
            // Try to save the item into the es
            try {
                const itemInElastic = await elastic.getItemById(item.itemId);
                if (itemInElastic) {
                    // Update if item exists
                    await elastic.updateItem(itemInElastic.id, {
                        itemId: item.itemId,
                        type: item.type,
                        text: item.text || '',
                        author: item.by || '',
                        title: item.title || ''
                    });
                } else {
                    // Add item if doesn't exist
                    await elastic.addItem({
                        itemId: item.itemId,
                        type: item.type,
                        text: item.text || '',
                        author: item.by || '',
                        title: item.title || ''
                    });
                }
            } catch (err) {
                Logger.error({
                    location: 'fetchStory function',
                    error: err,
                    info: `Couldn't save item ${item.itemId} into elasticsearch`
                });
                throw err;
            }
        
            // Enqueue kid elements for fetching
            fetchedItem.kids?.forEach(kid => {
                itemsToFetchQueue.enqueue(kid);
            });
        } catch (err) {
            Logger.error({
                location: 'fetchStory function',
                error: err,
                info: 'Unexpected error occured during fetching process'
            });
            fetchingError = new ThirdPartyServiceError();
            throw err;
        }
    };

    await sequelize.transaction(async (t) => {
        // Assign transaction variable
        transaction = t;

        // Start fetching process by enqueuing the first itemId
        itemsToFetchQueue.enqueue(itemId);

        // Await for the whole item tree to be fetched
        await itemsToFetchQueue.listenersDone;
    });

    // If any error occured, throw it
    if (fetchingError) throw fetchingError;

    return;
}

export { fetchStory };