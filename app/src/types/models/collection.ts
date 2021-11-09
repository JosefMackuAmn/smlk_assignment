import { Model, Optional } from "sequelize/types";

import { SentItem } from "./item";

export interface CollectionAttrs {
    collectionId: number;
    name: string;
    userNick: string;
}

export interface CollectionCreationAttrs
    extends Optional<CollectionAttrs, 'collectionId'> {};

export interface CollectionInstance extends Model<
    CollectionAttrs, CollectionCreationAttrs
>, CollectionAttrs {
    createdAt: Date;
    updatedAt: Date;
};

export interface SentCollection {
    name: string;
    stories: (SentItem|null)[]
}