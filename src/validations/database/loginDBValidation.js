const Encryptor = require('../../utils/encryptor');
const DBValidation = require('./DBValidation');
const UsersService = require('../../services/usersService');

const db = new UsersService();

class LoginDBValidation extends DBValidation {
  constructor() {
    super();
    this.getLogger = this.getLogger.bind(this);
    this.validateUsernamePassword = this.validateUsernamePassword.bind(this);
    this.encryptor = new Encryptor();
  }

  validateUsernamePassword(username, password) {
    return db.getUser(username)
      .then((user) => {
        if (!user) {
          this.getLogger().info('No user found with specified username.');
          throw new this.Error(409, 'Error matching username and password.');
        } else {
          return this.encryptor.compare(password, user.password_hash)
            .then((match) => {
              if (match) {
                return user.password_hash;
              }
              this.getLogger().info('Miss match with username and password given.');
              throw new this.Error(409, 'Error matching username and password.');
            })
            .catch((e) => {
              this.getLogger().error(e.msg);
              throw new this.Error(409, 'Error matching username and password.');
            });
        }
      })
      .catch((e) => {
        this.getLogger().error(e.msg);
        throw new this.Error(e.code, e.msg);
      });
  }
}

module.exports = LoginDBValidation;
