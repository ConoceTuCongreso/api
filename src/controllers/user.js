const CODES = require('../utils/statusCodes');

class User {
  constructor(logger, encryptor, userService, userValidation) {
    this.logger = logger;
    this.encryptor = encryptor;
    this.userService = userService;
    this.userValidation = userValidation;

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.signup = this.signup.bind(this);
  }

  login(req, res) {
    const params = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };
    try {
      this.userValidation.validateInputLogin(params);
    } catch (e) {
      res.status(e.code).send(e.msg);
      return;
    }
    this.userService.validateUsernamePassword(params.username, params.email, params.password)
      .then((user) => {
        req.session.user = {
          id: user.user_id,
          username: req.body.username,
          email: req.body.email,
          password: user.password_hash,
        };
        this.logger.info(`Successful login, user: ${req.body.username}.`);
        res.status(CODES.OK).send('OK');
      })
      .catch((e) => {
        res.status(e.code).send(e.msg);
      });
  }

  logout(req, res) {
    res.clearCookie('user_sid');
    this.logger.info('Successful logout');
    res.status(CODES.RESET_CONTENT).send('OK');
  }

  signup(req, res) {
    const params = {
      first_name: req.body.first_name,
      username: req.body.username,
      middle_name: req.body.middle_name || '',
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    };

    try {
      this.userValidation.validateInputSignup(params);
    } catch (e) {
      res.status(e.code).send(e.msg);
      return;
    }
    this.userService.validateUsername(params.username)
      .then(() => {
        this.userService.validateEmail(params.email)
          .then(() => {
            this.encryptor.encrypt(req.body.password)
              .then((pass) => {
                this.userService.saveUser(
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
                  .then((user) => {
                    req.session.user = {
                      id: user.user_id,
                      username: user.username,
                      email: user.email,
                      password: user.password,
                    };
                    this.logger.info(`Successful registration, user: ${req.body.username}, email ${req.body.email}`);
                    res.status(CODES.OK).send('OK');
                  })
                  .catch((e) => {
                    this.logger.error(e);
                    res.status(CODES.INTERNAL_SERVER_ERROR).send('Internal Server Error');
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
  }
}

module.exports = User;
