import { NextFunction, Request, Response } from "express";

import { elastic } from '../elastic';

export const getSearch = async (req: Request, res: Response, next: NextFunction) => {
    const { q } = req.query as { q: string };

    let data;
    try {
        data = await elastic.getItem(q);
    } catch (err) {
        next(err);
    }

    res.send(data);
}