const Logger = require('../../utils/logger');
const Error = require('../../utils/statusError');

class DBValidation {
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

module.exports = DBValidation;
