import supertest from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../../app';
import { User } from '../../models/User';

import { DecodedJwt } from '../../types/misc';
import { ItemHierarchy } from '../../models/ItemHierarchy';
import { CollectionItem } from '../../models/CollectionItem';
import { Item } from '../../models/Item';
import { Collection } from '../../models/Collection';
import { sequelize } from '../../connection';

describe('Authentication routes', () => {
    beforeEach(async () => {
        await ItemHierarchy.drop();
        await CollectionItem.drop();
        await Item.drop();
        await Collection.drop();
        await User.drop();
        await sequelize.sync({ force: true });
    
        jest.clearAllMocks();
    });

    describe('POST /auth', () => {

        it('sends 400 on invalid data', async () => {
            const res = await supertest(app)
                .post('/auth')
                .send({
                    nick: '',
                    password: 123
                })
                .expect(400)
    
            expect(res.body.errors.length).toEqual(2);
    
            const userCount = await User.count();
            expect(userCount).toEqual(0);
        });
        
        it('sends 400 on empty data', async () => {
            const res = await supertest(app)
                .post('/auth')
                .send()
                .expect(400)
    
            expect(res.body.errors.length).toEqual(3);
    
            const userCount = await User.count();
            expect(userCount).toEqual(0);
        });
    
        it('sends 409 if nick is taken', async () => {
            await supertest(app)
                .post('/auth')
                .send({
                    nick: 'MyCoolNick',
                    password: 'MyDarkSecret'
                })
                .expect(201)
    
            await supertest(app)
                .post('/auth')
                .send({
                    nick: 'MyCoolNick',
                    password: 'MyDarkSecret'
                })
                .expect(409)
    
            const userCount = await User.count();
            expect(userCount).toEqual(1);
        });
    
        it('sends 201 and creates new user', async () => {
            await supertest(app)
                .post('/auth')
                .send({
                    nick: 'MyCoolNick',
                    password: 'MyDarkSecret'
                })
                .expect(201)
    
            const userCount = await User.count();
            expect(userCount).toEqual(1);
        });
    });
    
    describe('POST /auth/login', () => {
        it('sends 400 on invalid data', async () => {
            const res = await supertest(app)
                .post('/auth/login')
                .send({
                    nick: '',
                    password: 123
                })
                .expect(400)
    
            expect(res.body.errors.length).toEqual(2);
        });
        
        it('sends 400 on empty data', async () => {
            const res = await supertest(app)
                .post('/auth/login')
                .send()
                .expect(400)
    
            expect(res.body.errors.length).toEqual(3);
        });
        
        it('sends 401 on invalid credentials', async () => {
            await supertest(app)
                .post('/auth/login')
                .send({
                    nick: 'MyCoolNick',
                    password: 'MyDarkSecret'
                })
                .expect(401)
        });
        
        it('sends 200 and JWT', async () => {
            await supertest(app)
                .post('/auth')
                .send({
                    nick: 'MyCoolNick',
                    password: 'MyDarkSecret'
                })
                .expect(201)
    
            const { body } = await supertest(app)
                .post('/auth/login')
                .send({
                    nick: 'MyCoolNick',
                    password: 'MyDarkSecret'
                })
                .expect(200)
    
            const decoded = jwt.verify(body.jwt, process.env.TOKEN_KEY!) as DecodedJwt;
            expect(decoded.nick).toEqual('MyCoolNick');
        });
    });
})
