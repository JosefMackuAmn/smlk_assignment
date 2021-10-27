"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("../../app");
const User_1 = require("../../models/User");
describe('POST /auth', () => {
    it('sends 400 on invalid data', async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post('/auth')
            .send({
            nick: '',
            password: 123
        })
            .expect(400);
        expect(res.body.errors.length).toEqual(2);
        const userCount = await User_1.User.count();
        expect(userCount).toEqual(0);
    });
    it('sends 400 on empty data', async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post('/auth')
            .send()
            .expect(400);
        expect(res.body.errors.length).toEqual(3);
        const userCount = await User_1.User.count();
        expect(userCount).toEqual(0);
    });
    it('sends 409 if nick is taken', async () => {
        await (0, supertest_1.default)(app_1.app)
            .post('/auth')
            .send({
            nick: 'MyCoolNick',
            password: 'MyDarkSecret'
        })
            .expect(201);
        await (0, supertest_1.default)(app_1.app)
            .post('/auth')
            .send({
            nick: 'MyCoolNick',
            password: 'MyDarkSecret'
        })
            .expect(409);
        const userCount = await User_1.User.count();
        expect(userCount).toEqual(1);
    });
    it('sends 201 and creates new user', async () => {
        await (0, supertest_1.default)(app_1.app)
            .post('/auth')
            .send({
            nick: 'MyCoolNick',
            password: 'MyDarkSecret'
        })
            .expect(201);
        const userCount = await User_1.User.count();
        expect(userCount).toEqual(1);
    });
});
describe('POST /auth/login', () => {
    it('sends 400 on invalid data', async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post('/auth/login')
            .send({
            nick: '',
            password: 123
        })
            .expect(400);
        expect(res.body.errors.length).toEqual(2);
    });
    it('sends 400 on empty data', async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post('/auth/login')
            .send()
            .expect(400);
        expect(res.body.errors.length).toEqual(3);
    });
    it('sends 401 on invalid credentials', async () => {
        await (0, supertest_1.default)(app_1.app)
            .post('/auth/login')
            .send({
            nick: 'MyCoolNick',
            password: 'MyDarkSecret'
        })
            .expect(401);
    });
    it('sends 200 and JWT', async () => {
        await (0, supertest_1.default)(app_1.app)
            .post('/auth')
            .send({
            nick: 'MyCoolNick',
            password: 'MyDarkSecret'
        })
            .expect(201);
        const { body } = await (0, supertest_1.default)(app_1.app)
            .post('/auth/login')
            .send({
            nick: 'MyCoolNick',
            password: 'MyDarkSecret'
        })
            .expect(200);
        const decoded = jsonwebtoken_1.default.verify(body.jwt, process.env.TOKEN_KEY);
        expect(decoded.nick).toEqual('MyCoolNick');
    });
});
