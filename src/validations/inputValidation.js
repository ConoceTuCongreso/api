const Logger = require('../utils/logger');
const Error = require('../errors/statusError');

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
}

module.exports = InputValidation;
