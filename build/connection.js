"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
let dbName = 'smlk';
if (process.env.NODE_ENV === 'test') {
    dbName += '_test';
}
const sequelize = new sequelize_1.Sequelize(dbName, 'root', 'secret123', {
    dialect: 'mysql',
    host: 'localhost',
    logging: false
});
exports.sequelize = sequelize;
