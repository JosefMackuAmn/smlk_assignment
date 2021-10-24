import supertest from 'supertest';

import { app } from '../../app';
import { User } from '../../models/User';

describe('POST /auth', () => {
    it('sends 400 on invalid data', async () => {});
    
    it('sends 400 on empty data', async () => {});

    it('sends 409 if nick is taken', async () => {});

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