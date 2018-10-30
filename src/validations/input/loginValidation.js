const inputValidation = require('./inputValidation');

class LoginValidation extends inputValidation {
  constructor() {
    super();
    this.getLogger = this.getLogger.bind(this);
    this.validateInput = this.validateInput.bind(this);
  }

  validateInput(username, password) {
    if (!username || !password) {
      this.getLogger().info('Missing required parameters.');
      throw new this.Error(403, 'Missing required parameters.');
    }
  }
}

module.exports = LoginValidation;
