import supertest from "supertest";

import { app } from "../../app";

import { Clear } from "./util/Clear";
import { createCollection } from "./util/createCollection";
import { getJwt } from "./util/getJwt";

import { saveStory } from "./util/saveStory";

describe('GET /search', () => {
    beforeEach(async () => {
        await Clear.clearDB();
        await Clear.clearMocks();
        await Clear.clearElastic();
    });

    it('sends search results', async () => {
        const token = await getJwt();
        const collectionName = await createCollection(token);
        await saveStory(token, collectionName);
        await saveStory(token, collectionName);

        const { body } = await supertest(app)
            .get(`/search?q="story"`)
            .send()
            .expect(200)

        expect(body.length).toEqual(1);
    });
});