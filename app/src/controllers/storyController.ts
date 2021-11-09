import { Request, Response } from "express";

import { NotFoundError } from "../errors/NotFoundError";

import { Collection } from "../models/Collection";
import { CollectionItem } from "../models/CollectionItem";

import { fetchStory } from "../util/functions/fetchStory";

export const postStory = async (req: Request, res: Response) => {
    const { collectionName } = req.params;
    let storyId = parseInt(req.params.storyId);
    const userNick = req.decodedJwt!.nick;
    
    // Find collection
    const collection = await Collection.findOne({
        where: { name: collectionName, userNick }
    });
    if (!collection) throw new NotFoundError();

    // Fetch and process item & nested items
    await fetchStory(storyId, collection.collectionId);

    res.sendStatus(201);
}

export const deleteStory = async (req: Request, res: Response) => {
    const { collectionName, storyId } = req.params;
    const userNick = req.decodedJwt!.nick;

    // Retrieve collection
    const collection = await Collection.findOne({
        where: { name: collectionName, userNick }
    });
    if (!collection) throw new NotFoundError();

    // Destroy associations
    const destroyedCount = await CollectionItem.destroy({
        where: {
            collectionId: collection.collectionId,
            itemId: storyId
        }
    });
    if (!destroyedCount) throw new NotFoundError();

    res.sendStatus(200);
}