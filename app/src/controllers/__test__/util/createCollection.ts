import supertest from "supertest";

import { app } from "../../../app";

export const createCollection = async (
    jwt: string, collectionName: string = 'MyCollection'
) => {
    await supertest(app)
        .post('/collection')
        .send({
            name: collectionName,
            token: jwt
        })
        .expect(201)

    return collectionName;
}