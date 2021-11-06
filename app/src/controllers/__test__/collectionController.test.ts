import supertest from 'supertest';
import fetch from 'node-fetch';

import { app } from '../../app';
import { Collection } from '../../models/Collection';

import { FetchedItem } from '../../types/models/item';

import { getJwt } from './util/getJwt';
import { createCollection } from './util/createCollection';
import { ItemHierarchy } from '../../models/ItemHierarchy';
import { CollectionItem } from '../../models/CollectionItem';
import { Item } from '../../models/Item';
import { User } from '../../models/User';
import { sequelize } from '../../connection';

describe('Collection routes', () => {
    beforeEach(async () => {
        await ItemHierarchy.drop();
        await CollectionItem.drop();
        await Item.drop();
        await Collection.drop();
        await User.drop();
        await sequelize.sync({ force: true });
    
        jest.clearAllMocks();
    });
    
    describe('POST /collection', () => {
        it('sends 400 on invalid data', async () => {
            const token = await getJwt();
    
            const res = await supertest(app)
                .post('/collection')
                .send({
                    name: '',
                    token
                })
                .expect(400)
    
            expect(res.body.errors.length).toEqual(1);
        });
    
        it('sends 400 on empty data', async () => {
            const token = await getJwt();
    
            const res = await supertest(app)
                .post('/collection')
                .send({ token })
                .expect(400)
    
            expect(res.body.errors.length).toEqual(1);
        });
    
        it('sends 401 on missing jwt', async () => {
            await supertest(app)
                .post('/collection')
                .send()
                .expect(401)
        });
    
        it('sends 409 on collection name collision', async () => {
            const token = await getJwt();
    
            await supertest(app)
                .post('/collection')
                .send({
                    name: 'MyCollection', token
                })
                .expect(201)
    
            await supertest(app)
                .post('/collection')
                .send({
                    name: 'MyCollection', token
                })
                .expect(409)
        });
    
        it('sends 201 on successful collection creation', async () => {
            const token = await getJwt();
    
            await supertest(app)
                .post('/collection')
                .send({
                    name: 'MyCollection', token
                })
                .expect(201)
    
            const collCount = await Collection.count();
            expect(collCount).toEqual(1);
        });
    
        it('sends 201 on successful collection creation and does not interfere with other user\'s collections', async () => {
            const token1 = await getJwt('User1');
            await supertest(app)
                .post('/collection')
                .send({
                    name: 'MyCollection', token: token1
                })
                .expect(201)
    
            const token2 = await getJwt('User2');
            await supertest(app)
                .post('/collection')
                .send({
                    name: 'MyCollection', token: token2
                })
                .expect(201)
    
            const collCount = await Collection.count();
            expect(collCount).toEqual(2);
        });
    });
    
    
    describe('GET /collection/:collectionName', () => {
        it('sends 404 on non-existent collection', async () => {
            const token = await getJwt();
    
            await supertest(app)
                .get(`/collection/abc`)
                .send({ token })
                .expect(404)
        });
        
        it('sends 200 and collection', async () => {
            const token = await getJwt();
            const collectionName = await createCollection(token);
    
            // @ts-ignore
            fetch.mockImplementation(async (url: string) => {
                let jsonFcn:
                    () => Promise<FetchedItem|null> = async () => null;
                if (url.includes('123')) {
                    jsonFcn = async () => ({
                        id: 123,
                        type: 'story',
                        time: 123456789,
                        kids: [ 124 ]
                    });
                } else if (url.includes('124')) {
                    jsonFcn = async () => ({
                        id: 124,
                        type: 'comment',
                        time: 123456789,
                        parent: 123
                    });
                }
                return {
                    ok: true,
                    json: jsonFcn
                }
            });
    
            await supertest(app)
                .post(`/collection/${collectionName}/123`)
                .send({ token })
                .expect(201)
    
            const { body } = await supertest(app)
                .get(`/collection/${collectionName}`)
                .send({ token })
                .expect(200)
    
            expect(body.name).toEqual(collectionName);
            expect(body.stories).toHaveLength(1);
            expect(body.stories[0].kids).toHaveLength(1);
        });
    });
    
    
    describe('DELETE /collection/:collectionName', () => {
        it('sends 404 on non-existent collection', async () => {
            const token = await getJwt();
    
            await supertest(app)
                .delete(`/collection/abc`)
                .send({ token })
                .expect(404)
        });
        
        it('sends 200 on successful deletion', async () => {
            const token = await getJwt();
            const collectionName = await createCollection(token);
    
            await supertest(app)
                .delete(`/collection/${collectionName}`)
                .send({ token })
                .expect(200)
    
            const collCount = await Collection.count();
            expect(collCount).toEqual(0);
        });
    });
});