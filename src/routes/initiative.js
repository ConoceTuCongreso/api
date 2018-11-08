const express = require('express');
const Logger = require('../utils/logger');
const InitiativeController = require('../controllers/initiative');

const router = express.Router();

// Init validators and services
const logger = new Logger();
const initiativeController = new InitiativeController(logger);

router.get('/initiatives', initiativeController.initiative);

router.get('/initiatives/:initiativeId', initiativeController.initiativeById);

router.get('/initiatives/:initiativeId/votes', initiativeController.initiativeVotes);

module.exports = router;
