import { CustomError } from "./CustomError";

class UnprocessableEntityError extends CustomError {
    statusCode = 422;

    constructor() {
        super('Unprocessable Entity');
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}

export { UnprocessableEntityError };