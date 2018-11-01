const DBServices = require('./db');
const Encryptor = require('./encryptor');

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
        throw new this.Error(500, 'Error Connecting to database');
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
            this.getLogger().info(`Request for user ${variableToLookUp}.`);
            return (queryResponse.rows[0]);
          })
          .catch((e) => {
            client.release();
            this.getLogger().error(`Request for user ${variableToLookUp} failed. ${e}`);
            return e;
          });
      })
      .catch((e) => {
        this.getLogger().error(e);
        throw new this.Error(500, 'Error Connecting to database');
      });
  }

  validateUsernamePassword(username, password) {
    return this.getUser(username)
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

  validateUsername(username) {
    return this.getUser(username)
      .then((user) => {
        if (user) {
          this.getLogger().info('Username already taken.');
          throw new this.Error(409, 'Username already taken.');
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
          throw new this.Error(409, 'Email already taken.');
        }
      })
      .catch((e) => {
        this.getLogger().error(e);
        throw new this.Error(e.code, e.msg);
      });
  }
}

module.exports = UserService;