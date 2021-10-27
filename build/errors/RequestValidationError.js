"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
const CustomError_1 = require("./CustomError");
class RequestValidationError extends CustomError_1.CustomError {
    errors;
    statusCode = 400;
    constructor(errors) {
        super('Invalid request parameters');
        this.errors = errors;
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serializeErrors() {
        return this.errors.map(err => ({
            message: err.msg,
            field: err.param
        }));
    }
}
exports.RequestValidationError = RequestValidationError;
