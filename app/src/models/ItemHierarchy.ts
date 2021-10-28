import { DataTypes, Model, Optional } from "sequelize";

import { sequelize } from '../connection';

interface ItemHierarchyAttrs {
    id: number;
    itemId: number;
    parentId: number | null;
}

interface ItemHierarchyCreationAttrs extends Optional<ItemHierarchyAttrs, 'id'> {};

interface ItemHierarchyInstance extends Model<ItemHierarchyAttrs, ItemHierarchyCreationAttrs>, ItemHierarchyAttrs {
    createdAt: Date;
    updatedAt: Date;
};

const ItemHierarchy = sequelize.define<ItemHierarchyInstance, ItemHierarchyAttrs>('itemHierarchy', {
    id: {
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