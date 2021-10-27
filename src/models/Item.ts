import { DataTypes, Model } from "sequelize";

import { sequelize } from '../connection';

export enum ItemTypesEnum {
    story = 'story',
    comment = 'comment'
}

export interface ItemAttrs {
    id: number;
    deleted: boolean | undefined;
    type: ItemTypesEnum;
    by: string | undefined;
    time: number;
    text: string | undefined;
    dead: boolean | undefined;
    parent: number | undefined;
    url: string | undefined;
    score: number | undefined;
    title: string | undefined;
    descendants: number | undefined;
    collectionId: number;
}

interface ItemCreationAttrs extends ItemAttrs {};

interface ItemInstance extends Model<ItemAttrs, ItemCreationAttrs>, ItemAttrs {
    createdAt: Date;
    updatedAt: Date;
};

const Item = sequelize.define<ItemInstance, ItemAttrs>('item', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    by: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    time: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    text: DataTypes.STRING,
    dead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    parent: DataTypes.INTEGER,
    url: DataTypes.STRING,
    score: DataTypes.INTEGER,
    title: DataTypes.STRING,
    descendants: DataTypes.INTEGER,
    collectionId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'items'
});

export { Item };