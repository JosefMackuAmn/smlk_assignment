import { Request, Response } from "express";
import bcrypt from 'bcrypt';

import { SourceExistsError } from "../errors/SourceExistsError";
import { User } from "../models/User";

export const postNewUser = async (req: Request, res: Response) => {
    const { nick, password }: {
        nick: string,
        password: string
    } = req.body;

    // Check for existing user with the same nick
    const sameNickUser = await User.findOne({
        where: { nick }
    });
    if (sameNickUser) {
        throw new SourceExistsError();
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPwd = await bcrypt.hash(password, salt);

    // Build and save the user
    await User.create({
        nick: nick,
        password: hashedPwd
    });

    res.sendStatus(201);
}

export const postLogin = (req: Request, res: Response) => {}