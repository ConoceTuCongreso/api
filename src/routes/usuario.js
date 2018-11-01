const express = require('express');
const Logger = require('../utils/logger');
const Encryptor = require('../services/encryptor');
const UserValidation = require('../validations/userValidation');
const UserService = require('../services/userService');
const UserController = require('../controllers/user');

const router = express.Router();

// Init validators and services
const logger = new Logger();
const encryptor = new Encryptor();
const userService = new UserService();
const userValidation = new UserValidation();
const userController = new UserController(
  logger,
  encryptor,
  userService,
  userValidation,
);

router.post('/login', userController.login);

router.post('/logout', userController.logout);

router.post('/registro', userController.signup);

module.exports = router;
