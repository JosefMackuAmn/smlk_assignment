import { Request, Response } from "express";
import { QueryTypes } from "sequelize";

import { sequelize } from "../sequelize";

import { SourceExistsError } from "../errors/SourceExistsError";
import { NotFoundError } from "../errors/NotFoundError";

import { Collection } from "../models/Collection";
import { CollectionItem } from "../models/CollectionItem";

import { ItemWithParentId } from "../types/models/item";
import { SentCollection } from "../types/models/collection";

import { arrayToTree } from "../util/functions/arrayToTree";

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

    // Retrieve items
    const items = await sequelize.query<ItemWithParentId>(`
        WITH RECURSIVE
        itemsWithParentIdInCollection AS (
            -- Select all items in collection and append their parentId
            SELECT i1.*, ih1.parentId FROM (
                SELECT i.* FROM items i
                    JOIN collectionItems ci ON ci.itemId = i.itemId
                    WHERE ci.collectionId = ${collection.collectionId} ) i1
                JOIN itemHierarchies ih1 ON ih1.itemId = i1.itemId
        ), tree AS (
            -- Select top-level items for a given collection
            SELECT * FROM itemsWithParentIdInCollection
                WHERE parentId IS NULL
            UNION ALL
            -- Recursively select items with already selected items as parents
            SELECT i2.* FROM itemsWithParentIdInCollection i2
                JOIN tree t ON t.itemId = i2.parentId
        )
        SELECT
            itemId, deleted, type, 'by', time, text,
            dead, url, score, title, descendants, parentId
        FROM tree;
    `, { type: QueryTypes.SELECT });

    // Create item tree
    data.stories = arrayToTree(items);

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