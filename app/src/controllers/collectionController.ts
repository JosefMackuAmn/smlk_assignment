import { Request, Response } from "express";

import { SourceExistsError } from "../errors/SourceExistsError";
import { NotFoundError } from "../errors/NotFoundError";

import { Collection } from "../models/Collection";
import { CollectionItem } from "../models/CollectionItem";
import { Item } from "../models/Item";
import { asyncMap } from "../util/asyncMap";
import { ItemHierarchy } from "../models/ItemHierarchy";

import { SentCollection, WithItemId } from "../types/models/item";

export const postCollection = async (req: Request, res: Response) => {
    const { name }: { name: string } = req.body;
    const userNick = req.decodedJwt!.nick;

    // Check for collection with the same name
    // belonging to the current user
    const existingCollection = await Collection.findOne({
        where: {
            name: name, userNick
        }
    });
    if (existingCollection) throw new SourceExistsError();

    // Create new collection
    await Collection.create({ name, userNick });

    res.sendStatus(201);
}

export const getCollection = async (req: Request, res: Response) => {
    const { collectionName } = req.params;
    const userNick = req.decodedJwt!.nick;

    // Retrieve collection
    const collection = await Collection.findOne({
        where: { name: collectionName, userNick }
    });
    if (!collection) throw new NotFoundError();

    // Create data object to be sent
    const data: SentCollection = {
        name: collection.name,
        stories: []
    }

    // Retrieve story ids
    const storyIds = await CollectionItem.findAll({
        where: { collectionId: collection.collectionId },
        attributes: {
            include: ['itemId']
        }
    });

    // Retrieve stories
    const stories = await asyncMap(storyIds, async story => {
        const stories = await Item.findByPk(story.itemId);
        return stories;
    });
    data.stories = stories.map(story => {
        if (!story) return null;
        return {
            itemId: story.itemId,
            deleted: story.deleted,
            type: story.type,
            by: story.by,
            time: story.time,
            text: story.text,
            dead: story.dead,
            url: story.url,
            score: story.score,
            title: story.title,
            descendants: story.descendants,
            kids: []
        }
    })

    // Populate kids
    const populateKids = async (item: WithItemId|null) => {
        if (!item) return;

        // Get kid ids
        const kidIds = await ItemHierarchy.findAll({
            where: { parentId: item.itemId }
        });

        // Get kid instances
        const kids = await asyncMap(kidIds, async (kid) => {
            return await Item.findByPk(kid.itemId);
        });

        // Recursively populate nested kids
        await asyncMap(kids, populateKids);

        item.kids = kids;
    }
    await asyncMap(data.stories, populateKids);

    res.send(data);
}

export const deleteCollection = async (req: Request, res: Response) => {
    const { collectionName } = req.params;
    const userNick = req.decodedJwt!.nick;
    
    // Retrieve collection
    const collection = await Collection.findOne({
        where: { name: collectionName, userNick }
    });
    if (!collection) throw new NotFoundError();

    // Destroy associations
    await CollectionItem.destroy({
        where: { collectionId: collection.collectionId }
    });

    // Destroy collection
    await collection.destroy();

    res.sendStatus(200);
}