import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

import { InvalidCredentialsError } from "../errors/InvalidCredentialsError";

export interface DecodedJwt {
    nick: string;
    iat: number;
    exp: number;
 }

const isAuth = (req: Request, res: Response, next: NextFunction) => {
    const { token }: { token: string } = req.body;

    if (!token) {
        throw new InvalidCredentialsError();
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY!) as DecodedJwt;
        req.decodedJwt = decoded;
    } catch (err) {
        throw new InvalidCredentialsError();
    }

    next();
}

export { isAuth };