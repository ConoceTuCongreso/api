const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/login', userController.login);

router.post('/logout', userController.logout);

router.post('/registro', userController.signup);

module.exports = router;
