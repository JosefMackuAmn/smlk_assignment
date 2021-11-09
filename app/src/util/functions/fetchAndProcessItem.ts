import fetch from 'node-fetch';

import { elastic } from '../../elastic';

import { UnprocessableEntityError } from '../../errors/UnprocessableEntityError';
import { NotFoundError } from '../../errors/NotFoundError';

import { Item } from "../../models/Item";
import { CollectionItem } from "../../models/CollectionItem";
import { ItemHierarchy } from "../../models/ItemHierarchy";

import { asyncMap } from "./asyncMap";
import { Logger } from '../classes/Logger';

import { FetchedItem, ItemTypesEnum } from '../../types/models/item';
import { HACKER_NEWS_API } from '../../constants';

/**
 * @deprecated Inefficient, use fetchStory function instead
 */
const fetchAndProcessItem = async (itemId: number, collectionId?: number, firstLevel: boolean = false) => {
    // Fetch the item
    const itemData = await fetch(`${HACKER_NEWS_API}/item/${itemId}.json`);
    if (!itemData || !itemData.ok) throw new NotFoundError();
    
    // Get the item object
    const fetchedItem = await itemData.json() as FetchedItem;
    if (!fetchedItem) throw new NotFoundError();

    // Check the item type for 'story' (or 'comment')
    if (
        (firstLevel && fetchedItem.type !== ItemTypesEnum.story) ||
        !(fetchedItem.type in ItemTypesEnum)
    ) throw new UnprocessableEntityError();

    // Check for item existence in DB
    // save the item if doesn't exist yet
    let item = await Item.findByPk(fetchedItem.id);
    if (!item) {
        item = await Item.create({
            itemId: fetchedItem.id,
            ...fetchedItem
        });
    } else {
        await item.update({
            ...fetchedItem
        });
    }

    // Create association for only 'story'
    if (firstLevel && collectionId) {
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
            });
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
        });
    }

    // Try to save the item into the es
    try {
        await elastic.addItem({
            itemId: item.itemId,
            type: item.type,
            text: item.text || '',
            author: item.by || '',
            title: item.title || ''
        });
    } catch (err) {
        Logger.error({
            location: 'fetchAndProcessItem function',
            error: err,
            info: `Couldn't save item ${item.itemId} into elasticsearch`
        });
    }

    // Recursively fetch and process kid items
    if (fetchedItem.kids) {
        await asyncMap(fetchedItem.kids, async (kid) => {
            await fetchAndProcessItem(kid, collectionId);
        });
    }
}

export { fetchAndProcessItem };