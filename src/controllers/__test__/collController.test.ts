import supertest from 'supertest';
import fetch from 'node-fetch';

import { app } from '../../app';
import { Collection } from '../../models/Collection';
import { CollItem } from '../../models/CollItem';
import { FetchedItem } from '../fcns/fetchAndProcessItem';
import { Item } from '../../models/Item';

jest.mock('node-fetch');

// For some reason not working, temporary substituted with @ts-ignores
// const mockedFetch = fetch as jest.Mocked<typeof fetch>;

const getJwt = async (nick: string = 'MyCoolNick') => {
    await supertest(app)
            .post('/auth')
            .send({
                nick: nick,
                password: 'MyDarkSecret'
            })
            .expect(201)

    const { body } = await supertest(app)
        .post('/auth/login')
        .send({
            nick: nick,
            password: 'MyDarkSecret'
        })
        .expect(200)

    return body.jwt;
}

const createCollection = async (jwt: string, collName: string = 'MyCollection') => {
    await supertest(app)
        .post('/coll')
        .send({
            name: 'MyCollection',
            token: jwt
        })
        .expect(201)

    return collName;
}

describe('POST /coll', () => {
    it('sends 400 on invalid data', async () => {
        const token = await getJwt();

        const res = await supertest(app)
            .post('/coll')
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
            .post('/coll')
            .send({ token })
            .expect(400)

        expect(res.body.errors.length).toEqual(1);
    });

    it('sends 401 on missing jwt', async () => {
        await supertest(app)
            .post('/coll')
            .send()
            .expect(401)
    });

    it('sends 409 on collection name collision', async () => {
        const token = await getJwt();

        await supertest(app)
            .post('/coll')
            .send({
                name: 'MyCollection', token
            })
            .expect(201)

        await supertest(app)
            .post('/coll')
            .send({
                name: 'MyCollection', token
            })
            .expect(409)
    });

    it('sends 201 on successful collection creation', async () => {
        const token = await getJwt();

        await supertest(app)
            .post('/coll')
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
            .post('/coll')
            .send({
                name: 'MyCollection', token: token1
            })
            .expect(201)

        const token2 = await getJwt('User2');
        await supertest(app)
            .post('/coll')
            .send({
                name: 'MyCollection', token: token2
            })
            .expect(201)

        const collCount = await Collection.count();
        expect(collCount).toEqual(2);
    });
});


describe('GET /coll/:collName', () => {});


describe('DELETE /coll/:collName', () => {
    it('sends 404 on non-existent collection', async () => {
        const token = await getJwt();

        await supertest(app)
            .delete(`/coll/abc`)
            .send({ token })
            .expect(404)
    });
    
    it('sends 200 on successful deletion', async () => {
        const token = await getJwt();
        const collName = await createCollection(token);

        await supertest(app)
            .delete(`/coll/${collName}`)
            .send({ token })
            .expect(200)

        const collCount = await Collection.count();
        expect(collCount).toEqual(0);
    });
});


describe('POST /coll/:collName/:storyId', () => {
    it('sends 400 on invalid data', async () => {
        const token = await getJwt();
        const collName = await createCollection(token);

        const res = await supertest(app)
            .post(`/coll/${collName}/abc`)
            .send({ token })
            .expect(400)

        expect(res.body.errors.length).toEqual(1);
    });

    it('sends 404 on non-existent collection', async () => {
        const token = await getJwt();

        await supertest(app)
            .post(`/coll/abc/123`)
            .send({ token })
            .expect(404)
    });

    it('sends 404 on non-existent story', async () => {
        const token = await getJwt();
        const collName = await createCollection(token);

        // @ts-ignore
        fetch.mockResolvedValue(null);

        await supertest(app)
            .post(`/coll/${collName}/100`)
            .send({ token })
            .expect(404)
    });

    it('sends 422 on unprocessable item type', async () => {
        const token = await getJwt();
        const collName = await createCollection(token);

        // @ts-ignore
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                id: 120,
                type: 'job',
                time: 123456789
            })
        });

        await supertest(app)
            .post(`/coll/${collName}/120`)
            .send({ token })
            .expect(422)
    });

    it('sends 201 on successful adition', async () => {
        const token = await getJwt();
        const collName = await createCollection(token);

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
            .post(`/coll/${collName}/123`)
            .send({ token })
            .expect(201)

        const collItemsCount = await CollItem.count();
        expect(collItemsCount).toEqual(1);

        const itemCount = await Item.count();
        expect(itemCount).toEqual(2);

        expect(fetch).toHaveBeenCalledTimes(2);
    });
});


describe('DELETE /coll/:collName/:storyId', () => {
    it('sends 400 on invalid data', async () => {
        const token = await getJwt();
        const collName = await createCollection(token);

        await supertest(app)
            .delete(`/coll/${collName}/abc`)
            .send({ token })
            .expect(400);
    });

    it('sends 404 on non-existent collection', async () => {
        const token = await getJwt();

        await supertest(app)
            .delete(`/coll/nothing/123`)
            .send({ token })
            .expect(404);
    });

    it('sends 404 on non-existent story', async () => {
        const token = await getJwt();
        const collName = await createCollection(token);

        await supertest(app)
            .delete(`/coll/${collName}/123`)
            .send({ token })
            .expect(404);
    });

    it('sends 200 on successful deletion', async () => {
        const token = await getJwt();
        const collName = await createCollection(token);

        // @ts-ignore
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                id: 123,
                type: 'story',
                time: 123456789
            })
        });

        await supertest(app)
            .post(`/coll/${collName}/123`)
            .send({ token })
            .expect(201)

        let collItemsCount = await CollItem.count();
        expect(collItemsCount).toEqual(1);

        await supertest(app)
            .delete(`/coll/${collName}/123`)
            .send({ token })
            .expect(200);

        collItemsCount = await CollItem.count();
        expect(collItemsCount).toEqual(0);
    });
});