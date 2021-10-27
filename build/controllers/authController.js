"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLogin = exports.postNewUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SourceExistsError_1 = require("../errors/SourceExistsError");
const User_1 = require("../models/User");
const InvalidCredentialsError_1 = require("../errors/InvalidCredentialsError");
const postNewUser = async (req, res) => {
    const { nick, password } = req.body;
    // Check for existing user with the same nick
    const sameNickUser = await User_1.User.findByPk(nick);
    if (sameNickUser) {
        throw new SourceExistsError_1.SourceExistsError();
    }
    // Hash password
    const salt = await bcrypt_1.default.genSalt();
    const hashedPwd = await bcrypt_1.default.hash(password, salt);
    // Build and save the user
    await User_1.User.create({
        nick: nick,
        password: hashedPwd
    });
    res.sendStatus(201);
};
exports.postNewUser = postNewUser;
const postLogin = async (req, res) => {
    const { nick, password } = req.body;
    // Fetch user by nick
    const user = await User_1.User.findByPk(nick);
    if (!user) {
        throw new InvalidCredentialsError_1.InvalidCredentialsError();
    }
    // Compare passwords
    const pwdMatch = await bcrypt_1.default.compare(password, user.password);
    if (!pwdMatch) {
        throw new InvalidCredentialsError_1.InvalidCredentialsError();
    }
    const token = jsonwebtoken_1.default.sign({ nick }, process.env.TOKEN_KEY, {
        expiresIn: '2h'
    });
    res.status(200).send({ jwt: token });
};
exports.postLogin = postLogin;
