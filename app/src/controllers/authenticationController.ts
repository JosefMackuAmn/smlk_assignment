import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { SourceExistsError } from "../errors/SourceExistsError";
import { InvalidCredentialsError } from "../errors/InvalidCredentialsError";

import { User } from "../models/User";

export const postNewUser = async (req: Request, res: Response) => {
    const { nick: userNick, password }: {
        nick: string,
        password: string
    } = req.body;

    // Check for existing user with the same nick
    const sameNickUser = await User.findByPk(userNick);
    if (sameNickUser) throw new SourceExistsError();

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Build and save the user
    await User.create({
        userNick: userNick,
        password: hashedPassword
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
    const doesPasswordMatch = await bcrypt.compare(password, user.password);
    if (!doesPasswordMatch) throw new InvalidCredentialsError();

    // Create JWT
    const token = jwt.sign({ nick }, process.env.TOKEN_KEY!, {
        expiresIn: '2h'
    });

    res.status(200).send({ jwt: token });
}