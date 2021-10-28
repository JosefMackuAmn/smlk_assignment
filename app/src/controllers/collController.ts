import { Request, Response } from "express";

import { SourceExistsError } from "../errors/SourceExistsError";
import { NotFoundError } from "../errors/NotFoundError";

import { Collection } from "../models/Collection";

import { fetchAndProcessItem, FetchedItem } from "./fcns/fetchAndProcessItem";
import { CollItem } from "../models/CollItem";
import { Item, ItemInstance } from "../models/Item";
import { asyncForEach } from "../util/helpers";
import { ItemHierarchy } from "../models/ItemHierarchy";

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

interface SentItem extends Omit<FetchedItem, 'kids'> {
    kids: (SentItem|null)[];
}
interface SentCollection {
    name: string;
    stories: (SentItem|null)[]
}
interface WithID {
    id: string|number;
    [key: string]: any;
}

export const getCollection = async (req: Request, res: Response) => {
    const { collName } = req.params;
    const userNick = req.decodedJwt!.nick;

    // Retrieve collection
    const collection = await Collection.findOne({
        where: { name: collName, userNick }
    });
    if (!collection) throw new NotFoundError();

    // Create data object to be sent
    const data: SentCollection = {
        name: collection.name,
        stories: []
    }

    // Retrieve story ids
    const storyIds = await CollItem.findAll({
        where: { collectionId: collection.id },
        attributes: {
            include: ['itemId']
        }
    });

    // Retrieve stories
    const stories = await asyncForEach(storyIds, async story => {
        const stories = await Item.findByPk(story.itemId);
        return stories;
    });
    data.stories = stories.map(story => {
        if (!story) return null;
        return {
            id: story.id,
            deleted: story.deleted,
            type: story.type,
            by: story.by,
            time: story.time,
            text: story.text,
            dead: story.dead,
            parent: story.parent,
            url: story.url,
            score: story.score,
            title: story.title,
            descendants: story.descendants,
            kids: []
        }
    })

    // Populate kids
    const populateKids = async (item: WithID|null) => {
        if (!item) return;

        // Get kid ids
        const kidIds = await ItemHierarchy.findAll({
            where: { parentId: item.id }
        });

        // Get kid instances
        const kids = await asyncForEach(kidIds, async (kid) => {
            return await Item.findByPk(kid.itemId);
        });

        // Recursively populate nested kids
        await asyncForEach(kids, populateKids);

        item.kids = kids;
    }
    await asyncForEach(data.stories, populateKids);

    res.send(data);
}

export const deleteCollection = async (req: Request, res: Response) => {
    const { collName } = req.params;
    const userNick = req.decodedJwt!.nick;
    
    // Retrieve collection
    const collection = await Collection.findOne({
        where: { name: collName, userNick }
    });
    if (!collection) throw new NotFoundError();

    // Destroy associations
    await CollItem.destroy({
        where: { collectionId: collection.id }
    });

    // Destroy collection
    await collection.destroy();

    res.sendStatus(200);
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
    const userNick = req.decodedJwt!.nick;

    // Retrieve collection
    const collection = await Collection.findOne({
        where: { name: collName, userNick }
    });
    if (!collection) throw new NotFoundError();

    // Destroy associations
    const destroyedCount = await CollItem.destroy({
        where: {
            collectionId: collection.id,
            itemId: storyId
        }
    });
    if (!destroyedCount) throw new NotFoundError();

    res.sendStatus(200);
}