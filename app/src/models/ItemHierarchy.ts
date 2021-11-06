import { DataTypes } from "sequelize";

import { sequelize } from '../connection';

import { ItemHierarchyAttrs, ItemHierarchyInstance } from "../types/models/itemHierarchy";

const ItemHierarchy = sequelize.define<ItemHierarchyInstance, ItemHierarchyAttrs>('itemHierarchy', {
    hierarchyId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    itemId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    parentId: DataTypes.INTEGER
}, {
    tableName: 'itemHierarchies'
});

export { ItemHierarchy };