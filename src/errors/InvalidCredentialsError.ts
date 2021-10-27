import { CustomError } from "./CustomError";

class InvalidCredentialsError extends CustomError {
    statusCode = 401;

    constructor() {
        super('Invalid credentials');

        Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }]
    }
}

export { InvalidCredentialsError };