import { Model, Optional } from "sequelize/types";

export interface CollectionAttrs {
    collectionId: number;
    name: string;
    userNick: string;
}

export interface CollectionCreationAttrs extends Optional<CollectionAttrs, 'collectionId'> {};

export interface CollectionInstance extends Model<CollectionAttrs, CollectionCreationAttrs>, CollectionAttrs {
    createdAt: Date;
    updatedAt: Date;
};