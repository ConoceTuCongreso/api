const Encryptor = require('../utils/encryptor');
const Logger = require('../utils/logger');
const UserService = require('../services/usersService');
const LoginDBValidation = require('../validations/database/loginDBValidation');
const SignupDBValidation = require('../validations/database/signupDBValidation');
const LoginValidation = require('../validations/input/loginValidation');
const SignupValidation = require('../validations/input/signupValidation');

const logger = new Logger();
const encryptor = new Encryptor();
const userService = new UserService();
const loginDBValidation = new LoginDBValidation();
const signupDBValidation = new SignupDBValidation();
const loginValidation = new LoginValidation();
const signupValidation = new SignupValidation();

exports.login = (req, res) => {
  const params = { username: req.body.username, password: req.body.password };
  loginValidation.validateInput(params.username, params.password);
  loginDBValidation.validateUsernamePassword(params.username, params.password)
    .then((pass) => {
      req.session.user = {
        username: req.body.username,
        email: req.body.email,
        password: pass,
      };
      logger.info(`Successful login, user: ${req.body.username}.`);
      res.status(200).send('Successful Login.');
    })
    .catch((e) => {
      res.status(e.code).send(e.msg);
    });
};

exports.logout = (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
    logger.info('Successful logout');
    res.status(200).send('Successful sign out.');
  } else {
    res.status(400).send('You must be logged in to sign out.');
  }
};

exports.signup = (req, res) => {
  const params = {
    first_name: req.body.first_name,
    username: req.body.username,
    middle_name: req.body.middle_name || '',
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
  };

  signupValidation.validateInput(params);
  signupDBValidation.validateUsername(params.username)
    .then(() => {
      signupDBValidation.validateEmail(params.email)
        .then(() => {
          encryptor.encrypt(req.body.password)
            .then((pass) => {
              userService.saveUser(
                {
                  first_name: req.body.first_name,
                  username: req.body.username,
                  middle_name: req.body.middle_name || '',
                  last_name: req.body.last_name,
                  email: req.body.email,
                  salt: pass.salt,
                  hash: pass.password,
                },
              )
                .then(() => {
                  req.session.user = {
                    username: req.body.username,
                    email: req.body.email,
                    password: pass.password,
                  };
                  logger.info(`Successful registration, user: ${req.body.username}, email ${req.body.email}`);
                  res.status('200').send('Successful registration');
                })
                .catch((e) => {
                  logger.error(e);
                  res.status('500').send('Error connecting to the database');
                });
            });
        })
        .catch((e) => {
          res.status(e.code).send(e.msg);
        });
    })
    .catch((e) => {
      res.status(e.code).send(e.msg);
    });
};
