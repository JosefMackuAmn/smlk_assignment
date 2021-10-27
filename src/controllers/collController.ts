import { Request, Response } from "express";
import fetch from 'node-fetch';

import { Collection } from "../models/Collection";
import { SourceExistsError } from "../errors/SourceExistsError";
import { NotFoundError } from "../errors/NotFoundError";
import { Item, ItemAttrs, ItemTypesEnum } from "../models/Item";
import { UnprocessableEntityError } from "../errors/UnprocessableEntityError";

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

export const postStory = async (req: Request, res: Response) => {
    const { collName, storyId } = req.params;
    const userNick = req.decodedJwt!.nick;
    
    // Find collection
    const collection = await Collection.findOne({
        where: { name: collName, userNick }
    });
    if (!collection) throw new NotFoundError();

    // Fetch the item
    const storyData = await fetch(`${HNAPI}/item/${storyId}.json`);
    if (!storyData || !storyData.ok) throw new NotFoundError();
    
    // Get the item object
    const story = await storyData.json() as Omit<ItemAttrs, 'collectionId'>;
    if (!story) throw new NotFoundError();

    // Check the item type for 'story'
    if (story.type !== ItemTypesEnum.story) {
        throw new UnprocessableEntityError();
    }

    // Check for item existence in DB
    // create new item if doesn't exist yet
    let item = await Item.findByPk(story.id);
    if (!item) {
        item = await Item.create({
            ...story,
            collectionId: collection.id
        });
    }

    res.send(story);
}

export const deleteStory = async (req: Request, res: Response) => {
    const { collName, storyId } = req.params;
    console.log(collName, storyId);
}