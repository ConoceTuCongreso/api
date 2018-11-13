const validator = require('email-validator');
const inputValidation = require('./inputValidation');

class UserValidation extends inputValidation {
  constructor() {
    super();
    this.getLogger = this.getLogger.bind(this);
  }

  validateInputLogin(params) {
    if (params.username && params.email) {
      this.getLogger().info('Received too many parameters.');
      throw new this.Error(400, 'Received too many parameters.');
    }
    if (params.username && !params.email) {
      if (!params.password) {
        this.getLogger().info(`Missing required parameters. ${params.username} ${params.email} ${params.password}`);
        throw new this.Error(400, 'Missing required parameters.');
      }
    }
    if (!params.username && params.email) {
      if (!params.password) {
        this.getLogger().info(`Missing required parameters. ${params.username} ${params.email} ${params.password}`);
        throw new this.Error(400, 'Missing required parameters.');
      }
    }
    if ((!params.username && !params.email) || !params.password) {
      this.getLogger().info(`Missing required parameters. ${params.username} ${params.email} ${params.password}`);
      throw new this.Error(400, 'Missing required parameters.');
    }
  }

  validateInputSignup(params) {
    if (params.password.length < 8) {
      this.getLogger().info('Password given is shorter than the 8 characters previously established.');
      throw new this.Error(400, 'Password is too weak');
    }

    if (!(/[A-Z]/.test(params.password))) {
      this.getLogger().info(`Missing an upper case on password: ${params.password}`);
      throw new this.Error(400, 'Password is too weak');
    }

    if (!(/[!@#$%^&*(),.?":{}|<>]/).test(params.password)) {
      this.getLogger().info(`Missing an special character on password: ${params.password}`);
      throw new this.Error(400, 'Password is too weak');
    }

    if (!validator.validate(params.email)) {
      this.getLogger().info('Email given is not a valid email.');
      throw new this.Error(400, 'Username and/or email already registered"');
    }

    if (!params.username
        || !params.first_name
        || !params.last_name
        || !params.email
        || !params.password) {
      this.getLogger().info('Missing required parameters.');
      throw new this.Error(400, 'Missing required parameters.');
    }
  }
}

module.exports = UserValidation;
