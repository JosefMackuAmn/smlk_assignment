import express from 'express';
import ash from 'express-async-handler';
import { body } from 'express-validator';

import * as collectionController from '../controllers/collectionController';
import { validate } from '../middleware/validate';

const router = express.Router();

router.post('', [
    body('name')
        .notEmpty()
        .withMessage('name must not be empty')
        .isLength({ max: 20 })
        .withMessage('maximum name length is 20')
], validate, ash(collectionController.postCollection));

router.get('/:collectionName', ash(collectionController.getCollection));

router.delete('/:collectionName', ash(collectionController.deleteCollection));

export { router as collectionRouter };