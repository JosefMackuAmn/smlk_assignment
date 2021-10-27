"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("./routes/auth");
const coll_1 = require("./routes/coll");
const isAuth_1 = require("./middleware/isAuth");
const CustomError_1 = require("./errors/CustomError");
const Collection_1 = require("./models/Collection");
const User_1 = require("./models/User");
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.set('Content-Type', 'application/json');
    next();
});
app.use('/auth', auth_1.authRouter);
app.use('/coll', isAuth_1.isAuth, coll_1.collRouter);
app.use((req, res) => {
    res.sendStatus(404);
});
app.use((err, req, res, next) => {
    if (err instanceof CustomError_1.CustomError) {
        return res.status(err.statusCode).send({
            errors: err.serializeErrors()
        });
    }
    console.log("---------------------------------------");
    console.log(new Date().toString());
    console.log(`${req.method}: ${req.originalUrl}`);
    console.log("Express error handler:");
    console.log(err);
    console.log("---------------------------------------");
    res.status(500).send({
        errors: [{ message: "Unexpected error" }],
    });
});
Collection_1.Collection.belongsTo(User_1.User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User_1.User.hasMany(Collection_1.Collection);
