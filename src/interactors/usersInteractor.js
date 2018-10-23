const interactor = require('./Interactor');

class UserInteractor extends interactor {
  async saveUser(user) {
    (async () => {
      const client = await this.getDB().connect();
      try {
        const query = {
          text: 'INSERT INTO users(first_name, user_id, username, middle_name, last_name, email, password_salt, password_hash) VALUES($1, (SELECT uuid_generate_v1()), $2, $3, $4, $5, $6, $7)',
          values: [user.first_name,
            user.username,
            user.middle_name,
            user.last_name,
            user.email,
            user.salt,
            user.hash],
        };
        const queryResponse = await client.query(query);
        return queryResponse.rows[0];
      } finally {
        client.release();
      }
    })().catch(e => console.log(e));
  }

  getUser(user) {
    (async () => {
      const client = await this.getDB().connect();
      try {
        const query = {
          text: 'SELECT * FROM users WHERE username = $1',
          values: [user.name],
        };
        const queryResponse = await client.query(query);
        return queryResponse.rows[0];
      } finally {
        client.release();
      }
    })().catch(e => console.log(e));
  }
}

module.exports = UserInteractor;
