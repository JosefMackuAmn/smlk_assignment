import supertest from "supertest";

import { app } from "../../../app";

export const getJwt = async (nick: string = 'MyCoolNick') => {
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