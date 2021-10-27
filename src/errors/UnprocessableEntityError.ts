import { CustomError } from "./CustomError";

class UnprocessableEntityError extends CustomError {
    statusCode = 422;

    constructor() {
        super('Unprocessable Entity');

        Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}

export { UnprocessableEntityError };