const UserInteractor = require('../interactors/usersInteractor');
const Encryptor = require('../utils/encryptor');
const Logger = require('../utils/logger');

const logger = new Logger();
const userInteractor = new UserInteractor();
const encryptor = new Encryptor();

exports.login = (req, res) => {
  req.session.user = {
    username: req.body.username,
    email: req.body.email,
    password: req.password,
  };
  logger.info(`Successful login, user: ${req.body.username}.`);
  res.status(200).send('Successful Login.');
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
  encryptor.encrypt(req.body.password)
    .then((pass) => {
      userInteractor.saveUser(
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
};
