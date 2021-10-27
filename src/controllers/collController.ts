import { Request, Response } from "express";

import { Collection } from "../models/Collection";
import { User } from "../models/User";
import { SourceExistsError } from "../errors/SourceExistsError";

export const postCollection = async (req: Request, res: Response) => {
    const { name }: { name: string } = req.body;
    const userNick = req.decodedJwt!.nick;

    // Check for collection with the same name
    // belonging to the current user
    const existingColl = await Collection.findOne({
        where: {
            name: name, userNick
        }
    });
    if (existingColl) {
        throw new SourceExistsError();
    }

    // Create new collection
    await Collection.create({ name, userNick });

    res.sendStatus(201);
}
export const getCollection = async (req: Request, res: Response) => {}
export const deleteCollection = async (req: Request, res: Response) => {}

export const postStory = async (req: Request, res: Response) => {}
export const deleteStory = async (req: Request, res: Response) => {}