import { Model, Optional } from "sequelize/types";

export interface CollectionItemAttrs {
    collectionItemId: number;
    collectionId: number;
    itemId: number;
}

export interface CollectionItemCreationAttrs extends Optional<CollectionItemAttrs, 'collectionItemId'> {};

export interface CollectionItemInstance extends Model<CollectionItemAttrs, CollectionItemCreationAttrs>, CollectionItemAttrs {
    createdAt: Date;
    updatedAt: Date;
};