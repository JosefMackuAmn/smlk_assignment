import express from 'express';
import ash from 'express-async-handler';
import { body } from 'express-validator';

import * as collController from '../controllers/collController';
import { validate } from '../middleware/validate';

const router = express.Router();

router.post('', [
    body('name')
        .notEmpty()
        .withMessage('name must not be empty')
], validate, ash(collController.postCollection));
router.get('/:coll', ash(collController.getCollection));
router.delete('/:coll', ash(collController.deleteCollection));

router.post('/:coll/:storyId', ash(collController.postStory));
router.delete('/:coll/:storyId', ash(collController.deleteStory));

export { router as collRouter };