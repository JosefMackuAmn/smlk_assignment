import { NextFunction, Request, Response } from "express";

import { CustomError } from "../errors/CustomError";
import { CustomErrorMessage } from "../types/errors";
import { Logger } from "../util/classes/Logger";

// Handle 404 case
export const notFoundHandler = (req: Request, res: Response) => {
    res.sendStatus(404);
};

// Handle other errors
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Handle expected custom errors
    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({
            errors: err.serializeErrors()
        });
    }
    
    // Handle unexpected errors
    Logger.error({
        location: 'Express error handler',
        error: err,
        info: `${req.method}: ${req.originalUrl}`
    });

    // Create an error message in consistent format
    const errorMessage: CustomErrorMessage[] = [{
        message: 'Unexpected error'
    }];

    res.status(500).send({
        errors: errorMessage,
    });
    
};