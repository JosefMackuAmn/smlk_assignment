import { NextFunction, Request, Response } from "express";

import { elastic } from '../elastic';

export const getSearch = async (req: Request, res: Response, next: NextFunction) => {
    const { q } = req.query as { q: string };

    // Search for matching items
    const data = await elastic.searchItem(q);

    res.send(data);
}