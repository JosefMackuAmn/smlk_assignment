import { DataTypes, Model, Optional } from "sequelize";

import { sequelize } from '../connection';

interface CollectionAttrs {
    id: number;
    name: string;
    userNick: string;
}

interface CollectionCreationAttrs extends Optional<CollectionAttrs, 'id'> {};

interface CollectionInstance extends Model<CollectionAttrs, CollectionCreationAttrs>, CollectionAttrs {
    createdAt: Date;
    updatedAt: Date;
};

const Collection = sequelize.define<CollectionInstance, CollectionAttrs>('collection', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userNick: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'collections'
});

export { Collection };