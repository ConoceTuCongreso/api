const inputValidation = require('./inputValidation');
const UsersInteractor = require('../interactors/usersInteractor');
const Encryptor = require('../utils/encryptor');

class LoginValidation extends inputValidation {
  constructor() {
    super();
    this.getLogger = this.getLogger.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.validateUsernamePassword = this.validateUsernamePassword.bind(this);
  }

  validateInput(req, res, next) {
    if (!req.body.username || !req.body.password) {
      this.getLogger().info('Missing required parameters.');
      res.status(400).send('Missing required parameters.');
    } else {
      next();
    }
  }

  validateUsernamePassword(req, res, next) {
    const db = new UsersInteractor();
    db.getUser(req.body.username)
      .then((user) => {
        if (!user) {
          this.getLogger().info('No user found with specified username.');
          res.send('No matching user and password found.');
        } else {
          const encryptor = new Encryptor();
          encryptor.compare(req.body.password, user.password_hash)
            .then((match) => {
              if (match) {
                req.password = user.password_hash;
                next();
              } else {
                this.getLogger().info('Miss match with username and password given.');
                res.send('No matching user and password found.');
              }
            })
            .catch((e) => {
              this.getLogger().error(e);
              res.status(500).send('Error matching username and password.');
            });
        }
      })
      .catch((e) => {
        this.getLogger().error(e);
        res.status(500).send('Error connecting to the database.');
      });
  }
}

module.exports = LoginValidation;
