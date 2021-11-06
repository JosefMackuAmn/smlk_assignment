import { CustomError } from "./CustomError";

class SourceExistsError extends CustomError {
    statusCode = 409;

    constructor() {
        super('Source exists');
    }

    serializeErrors() {
        return [{ message: 'Source exists' }];
    };
}

export { SourceExistsError };