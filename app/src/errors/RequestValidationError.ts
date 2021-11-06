import { ValidationError } from 'express-validator';

import { CustomError } from "./CustomError";

class RequestValidationError extends CustomError {
    statusCode = 400;

    constructor(
        public errors: ValidationError[]
    ) {
        super('Invalid request parameters');
    }

    serializeErrors() {
        return this.errors.map(err => ({
            message: err.msg,
            field: err.param
        }));
    }
}

export { RequestValidationError };