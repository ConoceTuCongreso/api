const Logger = require('../../utils/logger');
const Error = require('../../utils/statusError');

class InputValidation {
  constructor() {
    this.init();
  }

  init() {
    this.logger = new Logger();
    this.Error = Error;
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
