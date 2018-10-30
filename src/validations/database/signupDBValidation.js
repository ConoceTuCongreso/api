const DBValidation = require('./DBValidation');
const UsersService = require('../../services/usersService');

const db = new UsersService();

class SignupDBValidation extends DBValidation {
  constructor() {
    super();
    this.getLogger = this.getLogger.bind(this);
    this.validateUsername = this.validateUsername.bind(this);
  }

  validateUsername(username) {
    return db.getUser(username)
      .then((user) => {
        if (user) {
          this.getLogger().info('Username already taken.');
          throw new this.Error(409, 'Username already taken.');
        }
      })
      .catch((e) => {
        this.getLogger().error(e);
        throw new this.Error(e.code, e.msg);
      });
  }

  validateEmail(email) {
    return db.getUser(email, 'email')
      .then((user) => {
        if (user) {
          this.getLogger().info('Email already taken.');
          throw new this.Error(409, 'Email already taken.');
        }
      })
      .catch((e) => {
        this.getLogger().error(e);
        throw new this.Error(e.code, e.msg);
      });
  }
}

module.exports = SignupDBValidation;
