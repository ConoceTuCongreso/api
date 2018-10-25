const inputValidation = require('./inputValidation');
const UsersInteractor = require('../interactors/usersInteractor');

class SignupValidation extends inputValidation {
  constructor() {
    super();
    this.getLogger = this.getLogger.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.validateUsername = this.validateUsername.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
  }

  validateInput(req, res, next) {
    if (!req.body.username
        || !req.body.password
        || !req.body.first_name
        || !req.body.last_name
        || !req.body.email
        || !req.body.password) {
      this.getLogger().info('Missing required parameters.');
      res.status('400').send('Missing required parameters.');
    } else {
      next();
    }
  }

  validateUsername(req, res, next) {
    const db = new UsersInteractor();
    db.getUser(req.body.username)
      .then((user) => {
        if (user) {
          this.getLogger().info('Username already taken.');
          res.status('400').send('Username already taken.');
        } else {
          next();
        }
      })
      .catch((e) => {
        this.getLogger().error(e);
        res.status(500).send('Error connecting to the database.');
      });
  }

  validateEmail(req, res, next) {
    const db = new UsersInteractor();
    db.getUser(req.body.email, 'email')
      .then((user) => {
        if (user) {
          this.getLogger().info('Email already taken.');
          res.status('400').send('Email already taken.');
        } else {
          next();
        }
      })
      .catch((e) => {
        this.getLogger().error(e);
        res.status(500).send('Error connecting to the database.');
      });
  }
}

module.exports = SignupValidation;
