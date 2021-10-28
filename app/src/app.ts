import express, { NextFunction, Request, Response } from 'express';

import { authRouter } from './routes/auth';
import { collRouter } from './routes/coll';

import { isAuth } from './middleware/isAuth';
import { CustomError } from './errors/CustomError';

import { Collection } from './models/Collection';
import { User } from './models/User';
import { Item } from './models/Item';
import { CollItem } from './models/CollItem';

const app = express();

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.set('Content-Type', 'application/json');
    next();
});

app.use('/auth', authRouter);
app.use('/coll', isAuth, collRouter);

app.use((req: Request, res: Response) => {
    res.sendStatus(404);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
});

Collection.belongsTo(User, {
    constraints: false,
    onDelete: 'CASCADE'
});
User.hasMany(Collection);

Item.belongsToMany(Collection, { through: CollItem });
Collection.belongsToMany(Item, { through: CollItem });

export { app };