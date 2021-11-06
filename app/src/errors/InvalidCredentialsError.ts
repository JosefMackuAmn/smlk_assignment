import { CustomError } from "./CustomError";

class InvalidCredentialsError extends CustomError {
    statusCode = 401;

    constructor() {
        super('Invalid credentials');
    }

    serializeErrors() {
        return [{ message: this.message }]
    }
}

export { InvalidCredentialsError };