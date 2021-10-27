import { DataTypes, HasManyCreateAssociationMixin, Model } from "sequelize";

import { sequelize } from '../connection';
import { Collection } from "./Collection";

interface UserAttrs {
    nick: string;
    password: string;
}

interface UserCreationAttrs extends UserAttrs {};

interface UserInstance extends Model<UserAttrs, UserCreationAttrs>, UserAttrs {
    createdAt: Date;
    updatedAt: Date;

    createCollection: HasManyCreateAssociationMixin<typeof Collection>;
};

const User = sequelize.define<UserInstance, UserAttrs>('user', {
    nick: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'users'
});

export { User };