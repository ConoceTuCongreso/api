const validator = require('email-validator');
const inputValidation = require('./inputValidation');
const CODES = require('../utils/statusCodes');

class UserValidation extends inputValidation {
  constructor() {
    super();
    this.getLogger = this.getLogger.bind(this);
  }

  validateInputLogin(params) {
    if (params.username && params.email) {
      this.getLogger().info('Received too many parameters.');
      throw new this.Error(CODES.BAD_REQUEST, 'Received too many parameters.');
    }
    if (params.username && !params.email) {
      if (!params.password) {
        this.getLogger().info(`Missing required parameters. ${params.username} ${params.email} ${params.password}`);
        throw new this.Error(CODES.BAD_REQUEST, 'Missing required parameters.');
      }
    }
    if (!params.username && params.email) {
      if (!params.password) {
        this.getLogger().info(`Missing required parameters. ${params.username} ${params.email} ${params.password}`);
        throw new this.Error(CODES.BAD_REQUEST, 'Missing required parameters.');
      }
    }
    if ((!params.username && !params.email) || !params.password) {
      this.getLogger().info(`Missing required parameters. ${params.username} ${params.email} ${params.password}`);
      throw new this.Error(CODES.BAD_REQUEST, 'Missing required parameters.');
    }
  }

  validateInputSignup(params) {
    if (params.first_name.length < 2 || params.first_name.length > 64) {
      this.getLogger().info('First name is not in the range of expected length');
      throw new this.Error(CODES.BAD_REQUEST, 'First name length must be longer than 2 and less than 64.');
    }

    if (params.username.length < 2 || params.username.length > 64) {
      this.getLogger().info('Username is not in the range of expected length');
      throw new this.Error(CODES.BAD_REQUEST, 'Username length must be longer than 2 and less than 64.');
    }

    if (params.last_name.length < 2 || params.last_name.length > 64) {
      this.getLogger().info('Last name is not in the range of expected length');
      throw new this.Error(CODES.BAD_REQUEST, 'Last name length must be longer than 2 and less than 64.');
    }

    if (params.middle_name.length > 64) {
      this.getLogger().info('Middle name is not in the range of expected length');
      throw new this.Error(CODES.BAD_REQUEST, 'Middle name length can not be greater than 64');
    }

    if (params.password.length < 8) {
      this.getLogger().info('Password given is shorter than the 8 characters previously established.');
      throw new this.Error(CODES.BAD_REQUEST, 'Password is too weak');
    }

    if (!(/[A-Z]/.test(params.password))) {
      this.getLogger().info(`Missing an upper case on password: ${params.password}`);
      throw new this.Error(CODES.BAD_REQUEST, 'Password is too weak');
    }

    if (!(/[!@#$%^&*(),.?":{}|<>]/).test(params.password)) {
      this.getLogger().info(`Missing an special character on password: ${params.password}`);
      throw new this.Error(CODES.BAD_REQUEST, 'Password is too weak');
    }

    if (!validator.validate(params.email)) {
      this.getLogger().info('Email given is not a valid email.');
      throw new this.Error(CODES.BAD_REQUEST, 'Invalid email');
    }

    if (!params.username
        || !params.first_name
        || !params.last_name
        || !params.email
        || !params.password) {
      this.getLogger().info('Missing required parameters.');
      throw new this.Error(CODES.BAD_REQUEST, 'Missing required parameters.');
    }
  }
}

module.exports = UserValidation;
