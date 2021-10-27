import { DataTypes, HasManyCreateAssociationMixin, Model, Optional } from "sequelize";

import { sequelize } from '../connection';

interface CollItemAttrs {
    id: number;
    collectionId: number;
    itemId: number;
}

interface CollItemCreationAttrs extends Optional<CollItemAttrs, 'id'> {};

interface CollItemInstance extends Model<CollItemAttrs, CollItemCreationAttrs>, CollItemAttrs {
    createdAt: Date;
    updatedAt: Date;
};

const CollItem = sequelize.define<CollItemInstance, CollItemAttrs>('collItem', {
    id: {
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
    tableName: 'collItems'
});

export { CollItem };