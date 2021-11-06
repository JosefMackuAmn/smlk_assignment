import { DataTypes } from "sequelize";

import { sequelize } from '../connection';

import { CollectionItemAttrs, CollectionItemInstance } from "../types/models/collectionItem";

const CollectionItem = sequelize.define<CollectionItemInstance, CollectionItemAttrs>('collectionItem', {
    collectionItemId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    collectionId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    itemId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'collectionItems'
});

export { CollectionItem };