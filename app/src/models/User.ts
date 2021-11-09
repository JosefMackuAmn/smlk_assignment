import { DataTypes } from "sequelize";

import { sequelize } from '../sequelize';

import { UserAttrs, UserInstance } from "../types/models/user";

const User = sequelize.define<UserInstance, UserAttrs>('user', {
    userNick: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false
    },
    password: {
        type: DataTypes.CHAR(60),
        allowNull: false
    }
}, {
    tableName: 'users'
});

export { User };