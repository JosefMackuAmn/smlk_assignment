"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.TOKEN_KEY = 'test';
const connection_1 = require("../connection");
beforeAll(async () => {
    await connection_1.sequelize.sync({ force: true });
});
beforeEach(async () => {
    await connection_1.sequelize.truncate();
});
afterAll(async () => {
    await connection_1.sequelize.close();
});
