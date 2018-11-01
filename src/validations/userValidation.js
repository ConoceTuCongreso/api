const inputValidation = require('./inputValidation');

class UserValidation extends inputValidation {
  constructor() {
    super();
    this.getLogger = this.getLogger.bind(this);
  }

  validateInputLogin(username, password) {
    if (!username || !password) {
      this.getLogger().info('Missing required parameters.');
      throw new this.Error(403, 'Missing required parameters.');
    }
  }

  validateInputSignup(params) {
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

module.exports = UserValidation;
