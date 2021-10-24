import { CustomError } from "./CustomError";

class SourceExistsError extends CustomError {
    statusCode = 409;

    constructor() {
        super('Source exists');

        Object.setPrototypeOf(this, SourceExistsError.prototype);
    }

    serializeErrors() {
        return [{ message: 'Source exists' }];
    };
}

export { SourceExistsError };