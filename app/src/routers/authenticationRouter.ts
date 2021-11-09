import express from 'express';
import ash from 'express-async-handler';
import { body } from 'express-validator';

import * as authenticationController from '../controllers/authenticationController';
import { validate } from '../middleware/validate';

const router = express.Router();

const validators = [
    body('nick')
        .notEmpty()
        .withMessage('nick must not be empty')
        .isLength({ max: 20 })
        .withMessage('maximum nick length is 20'),
    body('password')
        .notEmpty()
        .isLength({ min: 5 })
        .withMessage('password has to be at least 5 characters long')
];

router.post(
    '', validators, validate, ash(authenticationController.postNewUser)
);

router.post(
    '/login', validators, validate, ash(authenticationController.postLogin)
);

export { router as authenticationRouter };