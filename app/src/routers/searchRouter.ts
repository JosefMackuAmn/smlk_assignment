import express from 'express';
import ash from 'express-async-handler';
import { query } from 'express-validator';

import * as searchController from '../controllers/searchController';
import { validate } from '../middleware/validate';

const router = express.Router();

router.get('', [
    query('q')
        .notEmpty()
        .withMessage('query param "q" has to have a value')
        .isString()
        .withMessage('query param "q" has to be a string')
], validate, ash(searchController.getSearch));

export { router as searchRouter };