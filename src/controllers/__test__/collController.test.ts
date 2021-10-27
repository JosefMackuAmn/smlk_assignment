import supertest from 'supertest';

import { app } from '../../app';
import { Collection } from '../../models/Collection';

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

/*
400 on invalid data
            - 409 on collection name collision
            - 201 on successful collection creation
            */