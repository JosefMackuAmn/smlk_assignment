import express, { NextFunction, Request, Response } from 'express';

import { authenticationRouter } from './routers/authenticationRouter';
import { collectionRouter } from './routers/collectionRouter';
import { searchRouter } from './routers/searchRouter';
import { storyRouter } from './routers/storyRouter';
import * as errorController from './controllers/errorController';

import { isAuthenticated } from './middleware/isAuthenticated';

import { ModelAssociations } from './util/classes/ModelAssociations';

const app = express();

// Configuration and preprocessing
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
    res.set('Content-Type', 'application/json');
    next();
});

// Register routes
app.use('/auth', authenticationRouter);
app.use('/search', searchRouter);
app.use('/collection', isAuthenticated, collectionRouter);
app.use('/collection', isAuthenticated, storyRouter);

// Error handling
app.use(errorController.notFoundHandler);
app.use(errorController.errorHandler);

// Create model associations
ModelAssociations.create();

export { app };