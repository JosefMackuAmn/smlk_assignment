import fetch from 'node-fetch';

import * as elastic from '../../elastic';

import { UnprocessableEntityError } from '../../errors/UnprocessableEntityError';
import { NotFoundError } from '../../errors/NotFoundError';

import { Item, ItemAttrs, ItemTypesEnum } from "../../models/Item";
import { CollItem } from "../../models/CollItem";

import { asyncForEach } from "../../util/helpers";
import { ItemHierarchy } from "../../models/ItemHierarchy";

export const HNAPI = 'https://hacker-news.firebaseio.com/v0';

export interface FetchedItem extends Omit<ItemAttrs, 'collectionId'> {
    kids?: number[];
}

const fetchAndProcessItem = async (itemId: number, collectionId?: number, firstLevel: boolean = false) => {
    // Fetch the item
    const itemData = await fetch(`${HNAPI}/item/${itemId}.json`);
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
            ...fetchedItem
        });
    } else {
        await item.update({
            ...fetchedItem
        });
    }

    // Create association for only 'story'
    if (firstLevel && collectionId) {
        const collItemRecord = await CollItem.findOne({
            where: {
                collectionId: collectionId,
                itemId: item.id
            }
        });
        if (!collItemRecord) {
            await CollItem.create({
                collectionId: collectionId,
                itemId: item.id
            });
        }
    }

    // Create hierarchy record
    const parentId = item.parent || null;
    const itemHierarchyRecord = await ItemHierarchy.findOne({
        where: {
            itemId: item.id,
            parentId: parentId
        }
    });
    if (!itemHierarchyRecord) {
        await ItemHierarchy.create({
            itemId: item.id,
            parentId: parentId
        });
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
        console.log(`Couldn't save item ${item.id} into elasticsearch`);
    }

    // Recursively fetch and process kid items
    if (fetchedItem.kids) {
        await asyncForEach(fetchedItem.kids, async (kid) => {
            await fetchAndProcessItem(kid, collectionId);
        });
    }
}

export { fetchAndProcessItem };