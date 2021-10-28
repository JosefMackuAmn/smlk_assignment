import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { SourceExistsError } from "../errors/SourceExistsError";
import { User } from "../models/User";
import { InvalidCredentialsError } from "../errors/InvalidCredentialsError";

export const postNewUser = async (req: Request, res: Response) => {
    const { nick, password }: {
        nick: string,
        password: string
    } = req.body;

    // Check for existing user with the same nick
    const sameNickUser = await User.findByPk(nick);
    if (sameNickUser) throw new SourceExistsError();

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

export const postLogin = async (req: Request, res: Response) => {
    const { nick, password }: {
        nick: string,
        password: string
    } = req.body;

    // Fetch user by nick
    const user = await User.findByPk(nick);
    if (!user) throw new InvalidCredentialsError();

    // Compare passwords
    const pwdMatch = await bcrypt.compare(password, user.password);
    if (!pwdMatch) throw new InvalidCredentialsError();

    const token = jwt.sign({ nick }, process.env.TOKEN_KEY, {
        expiresIn: '2h'
    });

    res.status(200).send({ jwt: token });
}