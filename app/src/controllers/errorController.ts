import { NextFunction, Request, Response } from "express";

import { CustomError } from "../errors/CustomError";

// Handle 404 case
export const notFoundHandler = (req: Request, res: Response) => {
    res.sendStatus(404);
};

// Handle other errors
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({
            errors: err.serializeErrors()
        });
    }
    
    console.log("---------------------------------------");
    console.log(new Date().toString());
    console.log(`${req.method}: ${req.originalUrl}`)
    console.log("Express error handler:");
    console.log(err);
    console.log("---------------------------------------");
    res.status(500).send({
        errors: [{ message: "Unexpected error" }],
    });
    
};