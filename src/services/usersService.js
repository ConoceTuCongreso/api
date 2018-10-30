const DBServices = require('./DBServices');

class UserService extends DBServices {
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
}

module.exports = UserService;
