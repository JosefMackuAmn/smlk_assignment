import { DataTypes, Model } from "sequelize";

import { sequelize } from '../connection';

export enum ItemTypesEnum {
    story = 'story',
    comment = 'comment'
}

export interface ItemAttrs {
    id: number;
    deleted?: boolean;
    type: string;
    by?: string;
    time: number;
    text?: string;
    dead?: boolean;
    parent?: number;
    url?: string;
    score?: number;
    title?: string;
    descendants?: number;
}

interface ItemCreationAttrs extends ItemAttrs {};

export interface ItemInstance extends Model<ItemAttrs, ItemCreationAttrs>, ItemAttrs {
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
    text: DataTypes.TEXT,
    dead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    parent: DataTypes.INTEGER,
    url: DataTypes.STRING,
    score: DataTypes.INTEGER,
    title: DataTypes.STRING,
    descendants: DataTypes.INTEGER
}, {
    tableName: 'items'
});

export { Item };