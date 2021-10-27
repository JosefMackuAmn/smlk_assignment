"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceExistsError = void 0;
const CustomError_1 = require("./CustomError");
class SourceExistsError extends CustomError_1.CustomError {
    statusCode = 409;
    constructor() {
        super('Source exists');
        Object.setPrototypeOf(this, SourceExistsError.prototype);
    }
    serializeErrors() {
        return [{ message: 'Source exists' }];
    }
    ;
}
exports.SourceExistsError = SourceExistsError;
