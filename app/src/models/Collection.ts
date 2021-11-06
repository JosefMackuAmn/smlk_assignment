import { DataTypes } from "sequelize";

import { sequelize } from '../connection';

import { CollectionAttrs, CollectionInstance } from "../types/models/collection";

const Collection = sequelize.define<CollectionInstance, CollectionAttrs>('collection', {
    collectionId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    userNick: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    tableName: 'collections',
    indexes: [
        {
            name: 'nameByUserNick',
            unique: true,
            fields: ['userNick', 'name']
        }
    ]
});

export { Collection };