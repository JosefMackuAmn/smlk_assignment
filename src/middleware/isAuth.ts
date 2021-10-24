import { NextFunction, Request, Response } from "express";

const isAuth = (req: Request, res: Response, next: NextFunction) => {
    next();
}

export { isAuth };