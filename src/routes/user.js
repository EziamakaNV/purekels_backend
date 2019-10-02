/* eslint-disable linebreak-style */
import express from 'express';
import Validation from '../middleware/validations';

import UserController from '../controllers/User';

const router = express.Router();

router.post('/signup', Validation.signUpValidation, UserController.signup);

router.post('/signin', Validation.loginValidation, UserController.signin);

export default router;
