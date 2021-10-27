import { Request, Response } from "express";
import fetch from 'node-fetch';

import { SourceExistsError } from "../errors/SourceExistsError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnprocessableEntityError } from "../errors/UnprocessableEntityError";

import { Collection } from "../models/Collection";
import { Item, ItemAttrs, ItemTypesEnum } from "../models/Item";
import { CollItem } from "../models/CollItem";

import { asyncForEach } from "../util/helpers";
import { ItemHierarchy } from "../models/ItemHierarchy";

const HNAPI = 'https://hacker-news.firebaseio.com/v0';

export const postCollection = async (req: Request, res: Response) => {
    const { name }: { name: string } = req.body;
    const userNick = req.decodedJwt!.nick;

    // Check for collection with the same name
    // belonging to the current user
    const existingColl = await Collection.findOne({
        where: {
            name: name, userNick
        }
    });
    if (existingColl) throw new SourceExistsError();

    // Create new collection
    await Collection.create({ name, userNick });

    res.sendStatus(201);
}
export const getCollection = async (req: Request, res: Response) => {
    const { collName } = req.params;

}
export const deleteCollection = async (req: Request, res: Response) => {
    const { collName } = req.params;
    
}

interface FetchedItem extends Omit<ItemAttrs, 'collectionId'> {
    kids: number[];
}

export const postStory = async (req: Request, res: Response) => {
    const { collName } = req.params;
    let storyId = parseInt(req.params.storyId);
    const userNick = req.decodedJwt!.nick;
    
    // Find collection
    const collection = await Collection.findOne({
        where: { name: collName, userNick }
    });
    if (!collection) throw new NotFoundError();

    const fetchAndProcessItem = async (itemId: number, firstLevel: boolean = false) => {
        // Fetch the item
        const itemData = await fetch(`${HNAPI}/item/${itemId}.json`);
        if (!itemData || !itemData.ok) throw new NotFoundError();
        
        // Get the item object
        const fetchedItem = await itemData.json() as FetchedItem;
        if (!fetchedItem) throw new NotFoundError();
    
        // Check the item type for 'story' (or 'comment')
        if (firstLevel && fetchedItem.type !== ItemTypesEnum.story) {
            throw new UnprocessableEntityError();
        } else if (!Object.values(ItemTypesEnum).includes(fetchedItem.type)) {
            throw new UnprocessableEntityError();
        }
    
        // Check for item existence in DB
        // save the item if doesn't exist yet
        let item = await Item.findByPk(fetchedItem.id);
        if (!item) {
            item = await Item.create({
                ...fetchedItem,
                collectionId: collection.id
            });
        }
    
        // Create association
        const collItemRecord = await CollItem.findOne({
            where: {
                collectionId: collection.id,
                itemId: item.id
            }
        });
        if (!collItemRecord) {
            await CollItem.create({
                collectionId: collection.id,
                itemId: item.id
            });
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
    
        // Recursively fetch and process kid items
        if (fetchedItem.kids) {
            await asyncForEach(fetchedItem.kids, async (kid) => {
                await fetchAndProcessItem(kid);
            });
        }
    }
    await fetchAndProcessItem(storyId, true);

    res.sendStatus(201);
}

export const deleteStory = async (req: Request, res: Response) => {
    const { collName, storyId } = req.params;
    console.log(collName, storyId);
}