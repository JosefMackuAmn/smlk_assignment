import fetch from "node-fetch";
import supertest from "supertest";

import { app } from "../../../app";

import { FetchedItem } from "../../../types/models/item";

const saveStory = async (token: string, collectionName: string) => {
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
}

export { saveStory };