const express = require('express');
const Logger = require('../utils/logger');
const sessionChecker = require('../middleware/sessionChecker');
const InitiativeController = require('../controllers/initiative');
const InitiativeValidation = require('../validations/initiativeValidation');
const InitiativeService = require('../services/iniciativeService');

const router = express.Router();

// Init validators and services
const logger = new Logger();
const initiativeValidation = new InitiativeValidation();
const initiativeService = new InitiativeService();
const initiativeController = new InitiativeController(
  logger,
  initiativeService,
  initiativeValidation,
);

router.get('/initiatives', initiativeController.initiatives);

router.get('/initiatives/:initiativeId', initiativeController.initiativeById);

router.get('/initiatives/:initiativeId/votes', initiativeController.initiativeVotes);

router.post('/initiatives/:initiativeId/addToFavorites', sessionChecker, initiativeController.addToFavorites);

router.post('/initiatives/:initiativeId/sign', sessionChecker, initiativeController.sign);


module.exports = router;
