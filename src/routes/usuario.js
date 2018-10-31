const express = require('express');
const Logger = require('../utils/logger');
const LoginValidator = require('../validations/input/loginValidation');
const SignupValidator = require('../validations/input/signupValidation');
const LoginDBValidation = require('../validations/database/loginDBValidation');
const SignupDBValidation = require('../validations/database/signupDBValidation');
const UserService = require('../services/usersService');
const UserController = require('../controllers/user');

const router = express.Router();

// Init validators and services
const logger = new Logger();
const loginValidator = new LoginValidator();
const signupValidator = new SignupValidator();
const loginDBValidation = new LoginDBValidation();
const signupDBValidation = new SignupDBValidation();
const userService = new UserService();
const userController = new UserController(
  logger,
  loginValidator,
  signupValidator,
  loginDBValidation,
  signupDBValidation,
  userService,
);

router.post('/login', userController.login);

router.post('/logout', userController.logout);

router.post('/registro', userController.signup);

module.exports = router;
