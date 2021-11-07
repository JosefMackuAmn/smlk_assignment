import { CustomError } from "./CustomError";

class ThirdPartyServiceError extends CustomError {
    statusCode = 503;

    constructor() {
        super('Service Unavailable');
    }

    serializeErrors() {
        return [{
            message: 'Service Unavailable'
        }];
    }
}

export { ThirdPartyServiceError };