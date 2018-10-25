const express = require('express');
const LoginValidation = require('../validations/loginValidation');
const SignupValidation = require('../validations/signupValidation');
const userController = require('../controllers/userController');

const loginValidation = new LoginValidation();
const signupValidation = new SignupValidation();

const router = express.Router();

router.post('/login', loginValidation.validateInput, loginValidation.validateUsernamePassword, userController.login);

router.post('/logout', userController.logout);

router.post('/registro', signupValidation.validateInput, signupValidation.validateUsername, signupValidation.validateEmail, userController.signup);

module.exports = router;
