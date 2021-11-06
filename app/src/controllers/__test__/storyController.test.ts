import supertest from "supertest";
import fetch from "node-fetch";

import { app } from "../../app";
import { CollectionItem } from "../../models/CollectionItem";
import { Item } from "../../models/Item";

import { getJwt } from "./util/getJwt";
import { createCollection } from "./util/createCollection";

import { FetchedItem } from "../../types/models/item";

describe('POST /collection/:collectionName/:storyId', () => {
    it('sends 400 on invalid data', async () => {
        const token = await getJwt();
        const collectionName = await createCollection(token);

        const res = await supertest(app)
            .post(`/collection/${collectionName}/abc`)
            .send({ token })
            .expect(400)

        expect(res.body.errors.length).toEqual(1);
    });

    it('sends 404 on non-existent collection', async () => {
        const token = await getJwt();

        await supertest(app)
            .post(`/collection/abc/123`)
            .send({ token })
            .expect(404)
    });

    it('sends 404 on non-existent story', async () => {
        const token = await getJwt();
        const collectionName = await createCollection(token);

        // @ts-ignore
        fetch.mockResolvedValue(null);

        await supertest(app)
            .post(`/collection/${collectionName}/100`)
            .send({ token })
            .expect(404)
    });

    it('sends 422 on unprocessable item type', async () => {
        const token = await getJwt();
        const collectionName = await createCollection(token);

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
            .post(`/collection/${collectionName}/120`)
            .send({ token })
            .expect(422)
    });

    it('sends 201 on successful adition', async () => {
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

        const collectionItemsCount = await CollectionItem.count();
        expect(collectionItemsCount).toEqual(1);

        const itemCount = await Item.count();
        expect(itemCount).toEqual(2);

        expect(fetch).toHaveBeenCalledTimes(2);
    });
});


describe('DELETE /collection/:collectionName/:storyId', () => {
    it('sends 400 on invalid data', async () => {
        const token = await getJwt();
        const collectionName = await createCollection(token);

        await supertest(app)
            .delete(`/collection/${collectionName}/abc`)
            .send({ token })
            .expect(400);
    });

    it('sends 404 on non-existent collection', async () => {
        const token = await getJwt();

        await supertest(app)
            .delete(`/collection/nothing/123`)
            .send({ token })
            .expect(404);
    });

    it('sends 404 on non-existent story', async () => {
        const token = await getJwt();
        const collectionName = await createCollection(token);

        await supertest(app)
            .delete(`/collection/${collectionName}/123`)
            .send({ token })
            .expect(404);
    });

    it('sends 200 on successful deletion', async () => {
        const token = await getJwt();
        const collectionName = await createCollection(token);

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
            .post(`/collection/${collectionName}/123`)
            .send({ token })
            .expect(201)

        let collectionItemsCount = await CollectionItem.count();
        expect(collectionItemsCount).toEqual(1);

        await supertest(app)
            .delete(`/collection/${collectionName}/123`)
            .send({ token })
            .expect(200);

        collectionItemsCount = await CollectionItem.count();
        expect(collectionItemsCount).toEqual(0);
    });
});