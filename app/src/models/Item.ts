import { DataTypes } from "sequelize";

import { sequelize } from '../sequelize';

import { ItemAttrs, ItemInstance, ItemTypesEnum } from "../types/models/item";

const Item = sequelize.define<ItemInstance, ItemAttrs>('item', {
    itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    type: {
        type: DataTypes.ENUM(...Object.keys(ItemTypesEnum)),
        allowNull: false
    },
    by: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    text: DataTypes.TEXT,
    dead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    url: DataTypes.STRING,
    score: DataTypes.MEDIUMINT.UNSIGNED,
    title: DataTypes.STRING,
    descendants: DataTypes.SMALLINT.UNSIGNED
}, {
    tableName: 'items'
});

export { Item };