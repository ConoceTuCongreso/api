const Logger = require('../utils/logger');

class InputValidation {
  constructor() {
    this.init();
  }

  init() {
    this.logger = new Logger();
  }

  getLogger() {
    return this.logger;
  }

  validateInput(req, res, next) {
    this.logger.info(req);
    this.logger.info(res);
    next();
    return new Error('Any subclass needs to implement this method');
  }
}

module.exports = InputValidation;
