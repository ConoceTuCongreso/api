class User {
  constructor(logger, encryptor, userService, loginDBValidation,
    signupDBValidation, loginValidation, signupValidation) {
    this.logger = logger;
    this.encryptor = encryptor;
    this.userService = userService;
    this.loginDBValidation = loginDBValidation;
    this.signupDBValidation = signupDBValidation;
    this.loginValidation = loginValidation;
    this.signupValidation = signupValidation;

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.signup = this.signup.bind(this);
  }

  login(req, res) {
    const params = { username: req.body.username, password: req.body.password };
    try {
      this.loginValidation.validateInput(params.username, params.password);
    } catch (e) {
      res.status(e.code).send(e.msg);
      return;
    }
    this.loginDBValidation.validateUsernamePassword(params.username, params.password)
      .then((pass) => {
        req.session.user = {
          username: req.body.username,
          email: req.body.email,
          password: pass,
        };
        this.logger.info(`Successful login, user: ${req.body.username}.`);
        res.status(200).send('Successful Login.');
      })
      .catch((e) => {
        res.status(e.code).send(e.msg);
      });
  }

  logout(req, res) {
    if (req.session.user && req.cookies.user_sid) {
      res.clearCookie('user_sid');
      this.logger.info('Successful logout');
      res.status(200).send('Successful sign out.');
    } else {
      res.status(400).send('You must be logged in to sign out.');
    }
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
      this.signupValidation.validateInput(params);
    } catch (e) {
      res.status(e.code).send(e.msg);
      return;
    }
    this.signupDBValidation.validateUsername(params.username)
      .then(() => {
        this.signupDBValidation.validateEmail(params.email)
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
                  .then(() => {
                    req.session.user = {
                      username: req.body.username,
                      email: req.body.email,
                      password: pass.password,
                    };
                    this.logger.info(`Successful registration, user: ${req.body.username}, email ${req.body.email}`);
                    res.status('200').send('Successful registration');
                  })
                  .catch((e) => {
                    this.logger.error(e);
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
  }
}

module.exports = User;
