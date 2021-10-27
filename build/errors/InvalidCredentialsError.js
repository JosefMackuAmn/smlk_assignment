"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCredentialsError = void 0;
const CustomError_1 = require("./CustomError");
class InvalidCredentialsError extends CustomError_1.CustomError {
    statusCode = 401;
    constructor() {
        super('Invalid credentials');
        Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message }];
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
