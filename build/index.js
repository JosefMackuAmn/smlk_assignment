"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const connection_1 = require("./connection");
const PORT = process.env.PORT || 8080;
connection_1.sequelize.sync( /* { force: true } */).then(() => {
    console.log('Connected to database!');
    app_1.app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}!`);
    });
});
