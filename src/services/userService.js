const DBServices = require('./db');
const Encryptor = require('./encryptor');
const CODES = require('../utils/statusCodes');

class UserService extends DBServices {
  constructor() {
    super();
    this.encryptor = new Encryptor();
  }

  saveUser(user) {
    return this.getDB().connect()
      .then((client) => {
        const text = 'INSERT INTO users(first_name, user_id, username, middle_name, last_name, email, password_salt, password_hash) VALUES($1, (SELECT uuid_generate_v4()), $2, $3, $4, $5, $6, $7) RETURNING *';
        const values = [user.first_name,
          user.username,
          user.middle_name,
          user.last_name,
          user.email,
          user.salt,
          user.hash];
        return client.query(text, values)
          .then((result) => {
            client.release();
            return result;
          })
          .catch((e) => {
            client.release();
            this.getLogger().error(`Request to insert failed. ${e}`);
            return e;
          });
      })
      .catch((e) => {
        this.getLogger().error(e);
        throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Internal Server Error');
      });
  }

  getUser(variableToLookUp, nameOfVariableToUse = 'username') {
    return this.getDB().connect()
      .then((client) => {
        const query = {
          text: `SELECT * FROM users WHERE ${nameOfVariableToUse} = $1`,
          values: [variableToLookUp],
        };
        return client.query(query)
          .then((queryResponse) => {
            client.release();
            this.getLogger().info(`Request for ${nameOfVariableToUse} ${variableToLookUp}.`);
            return (queryResponse.rows[0]);
          })
          .catch((e) => {
            client.release();
            this.getLogger().error(`Request for ${nameOfVariableToUse} ${variableToLookUp} failed. ${e}`);
            return e;
          });
      })
      .catch((e) => {
        this.getLogger().error(e);
        throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Internal Server Error');
      });
  }

  validateUsernamePassword(username, email, password) {
    let nameOfVariableToUse = 'username';
    let variableToLookUp = username;
    if (email && !username) {
      nameOfVariableToUse = 'email';
      variableToLookUp = email;
    }
    return this.getUser(variableToLookUp, nameOfVariableToUse)
      .then((user) => {
        if (!user) {
          this.getLogger().info('No user found with specified username.');
          throw new this.Error(CODES.UNAUTHORIZED, 'Invalid username/email and/or password');
        } else {
          return this.encryptor.compare(password, user.password_hash)
            .then((match) => {
              if (match) {
                return user;
              }
              this.getLogger().info('Miss match with username and password given.');
              throw new this.Error(CODES.UNAUTHORIZED, 'Invalid username/email and/or password');
            })
            .catch((e) => {
              this.getLogger().error(e.msg);
              throw new this.Error(CODES.UNAUTHORIZED, 'Invalid username/email and/or password');
            });
        }
      })
      .catch((e) => {
        this.getLogger().error(e.msg);
        throw new this.Error(e.code, e.msg);
      });
  }

  validateUsername(username) {
    return this.getUser(username)
      .then((user) => {
        if (user) {
          this.getLogger().info('Username already taken.');
          throw new this.Error(CODES.CONFLICT, 'Username and/or email already registered');
        }
      })
      .catch((e) => {
        this.getLogger().error(e);
        throw new this.Error(e.code, e.msg);
      });
  }

  validateEmail(email) {
    return this.getUser(email, 'email')
      .then((user) => {
        if (user) {
          this.getLogger().info('Email already taken.');
          throw new this.Error(CODES.BAD_REQUEST, 'Username and/or email already registered');
        }
      })
      .catch((e) => {
        this.getLogger().error(e);
        throw new this.Error(e.code, e.msg);
      });
  }
}

module.exports = UserService;
