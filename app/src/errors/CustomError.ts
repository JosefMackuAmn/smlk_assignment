import { CustomErrorMessage } from "../types/errors";

export abstract class CustomError extends Error {
    abstract statusCode: number;

    constructor(msg: string) {
        super(msg);
    }

    abstract serializeErrors(): CustomErrorMessage[];
}