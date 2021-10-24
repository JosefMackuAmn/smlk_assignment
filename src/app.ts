import express, { Request, Response } from 'express';

import { authRouter } from './routes/auth';
import { collRouter } from './routes/coll';

import { isAuth } from './middleware/isAuth';
import { CustomError } from './errors/CustomError';

const app = express();

app.use(express.json());

app.use('/auth', authRouter);
app.use('/coll', isAuth, collRouter);

app.use((err: any, req: Request, res: Response) => {
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
})

export { app };