"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const InvalidCredentialsError_1 = require("../errors/InvalidCredentialsError");
const isAuth = (req, res, next) => {
    const { token } = req.body;
    if (!token) {
        throw new InvalidCredentialsError_1.InvalidCredentialsError();
    }
    // Verify token
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY);
        req.decodedJwt = decoded;
    }
    catch (err) {
        throw new InvalidCredentialsError_1.InvalidCredentialsError();
    }
    next();
};
exports.isAuth = isAuth;
