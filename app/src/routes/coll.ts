import express from 'express';
import ash from 'express-async-handler';
import { body, param } from 'express-validator';

import * as collController from '../controllers/collController';
import { validate } from '../middleware/validate';

const router = express.Router();

router.post('', [
    body('name')
        .notEmpty()
        .withMessage('name must not be empty')
], validate, ash(collController.postCollection));
router.get('/:collName', ash(collController.getCollection));
router.delete('/:collName', ash(collController.deleteCollection));

router.post('/:collName/:storyId', [
    param('storyId')
        .isNumeric()
        .withMessage('storyId must be numeric')
], validate, ash(collController.postStory));

router.delete('/:collName/:storyId', [
    param('storyId')
        .isNumeric()
        .withMessage('storyId must be numeric')
], validate, ash(collController.deleteStory));

export { router as collRouter };