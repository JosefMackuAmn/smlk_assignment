import express from 'express';
import ash from 'express-async-handler';
import { body } from 'express-validator';

import * as authController from '../controllers/authController';
import { validate } from '../middleware/validate';

const router = express.Router();

const validators = [
    body('nick')
        .notEmpty()
        .withMessage('nick must not be empty'),
    body('password')
        .notEmpty()
        .isLength({ min: 5 })
        .withMessage('password has to be at least 5 characters long')
];

router.post('', validators, validate, ash(authController.postNewUser));

router.post('/login', validators, validate, ash(authController.postLogin));

export { router as authRouter };