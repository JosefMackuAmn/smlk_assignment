"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
;
;
const Collection = connection_1.sequelize.define('collection', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    userNick: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'collections'
});
exports.Collection = Collection;
