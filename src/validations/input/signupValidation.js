const inputValidation = require('./inputValidation');

class SignupValidation extends inputValidation {
  constructor() {
    super();
    this.getLogger = this.getLogger.bind(this);
    this.validateInput = this.validateInput.bind(this);
  }

  validateInput(params) {
    if (!params.username
        || !params.password
        || !params.first_name
        || !params.last_name
        || !params.email
        || !params.password) {
      this.getLogger().info('Missing required parameters.');
      throw new this.Error(403, 'Missing required parameters.');
    }
  }
}

module.exports = SignupValidation;
