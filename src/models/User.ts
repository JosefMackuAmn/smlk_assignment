import { DataTypes } from "sequelize";

import { sequelize } from '../connection';

const User = sequelize.define('user', {
    nick: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export { User };