import express from 'express';
import ash from 'express-async-handler';
import { param } from 'express-validator';

import * as storyController from '../controllers/storyController';
import { validate } from '../middleware/validate';

const router = express.Router();

router.post('/:collectionName/:storyId', [
    param('storyId')
        .isNumeric()
        .withMessage('storyId must be numeric')
], validate, ash(storyController.postStory));

router.delete('/:collectionName/:storyId', [
    param('storyId')
        .isNumeric()
        .withMessage('storyId must be numeric')
], validate, ash(storyController.deleteStory));

export { router as storyRouter };