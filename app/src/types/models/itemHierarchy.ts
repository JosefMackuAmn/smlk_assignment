import { Model, Optional } from "sequelize/types";

export interface ItemHierarchyAttrs {
    hierarchyId: number;
    itemId: number;
    parentId: number | null;
}

export interface ItemHierarchyCreationAttrs
    extends Optional<ItemHierarchyAttrs, 'hierarchyId'> {};

export interface ItemHierarchyInstance extends Model<
    ItemHierarchyAttrs, ItemHierarchyCreationAttrs
>, ItemHierarchyAttrs {
    createdAt: Date;
    updatedAt: Date;
};