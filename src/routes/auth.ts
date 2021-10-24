import express from 'express';
import ash from 'express-async-handler';
import { body } from 'express-validator';

import * as authController from '../controllers/authController';
import { validate } from '../middleware/validate';

const router = express.Router();

router.post('', [
    body('nick')
        .notEmpty()
        .withMessage('nick must not be empty'),
    body('password')
        .notEmpty()
        .isLength({ min: 5 })
        .withMessage('password has to be at least 5 characters long')
], validate, ash(authController.postNewUser));
router.post('/login', ash(authController.postLogin));

export { router as authRouter };