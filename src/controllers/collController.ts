import { Request, Response } from "express";

import { SourceExistsError } from "../errors/SourceExistsError";
import { NotFoundError } from "../errors/NotFoundError";

import { Collection } from "../models/Collection";

import { fetchAndProcessItem } from "./fcns/fetchAndProcessItem";

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
    const { collName } = req.params;
    let storyId = parseInt(req.params.storyId);
    const userNick = req.decodedJwt!.nick;
    
    // Find collection
    const collection = await Collection.findOne({
        where: { name: collName, userNick }
    });
    if (!collection) throw new NotFoundError();

    // Fetch and process item & nested items
    await fetchAndProcessItem(storyId, collection.id, true);

    res.sendStatus(201);
}

export const deleteStory = async (req: Request, res: Response) => {
    const { collName, storyId } = req.params;
    console.log(collName, storyId);
}