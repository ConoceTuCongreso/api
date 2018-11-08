const DBServices = require('./db');

class InitiativeService extends DBServices {
  getInitiatives() {
    return this.db.connect()
      .then((client) => {
        const text = 'SELECT * FROM iniciatives';
        return client.query(text)
          .then((result) => {
            client.release();
            return result;
          })
          .catch(() => {
            throw new this.Error(500, 'Error Connecting to database');
          });
      })
      .catch(() => {
        throw new this.Error(500, 'Error Connecting to database');
      });
  }

  getInitiativeById(id) {
    return this.db.connect()
      .then((client) => {
        const query = {
          text: 'SELECT * FROM initiatives WHERE initiative_id = $1',
          values: id,
        };
        client.query(query)
          .then((result) => {
            client.release();
            return result;
          })
          .catch(() => {
            throw new this.Error(500, 'Error Connecting to database');
          });
      })
      .catch(() => {
        throw new this.Error(500, 'Error Connecting to database');
      });
  }

  getInitiativeVotes(id) {
    return this.db.connect()
      .then((client) => {
        const query = {
          text: 'SELECT * FROM initiatives WHERE initiative = $1',
          values: id,
        };
        client.query(query)
          .then((result) => {
            client.release();
            return result;
          })
          .catch(() => {
            throw new this.Error(500, 'Error Connecting to database');
          });
      })
      .catch(() => {
        throw new this.Error(500, 'Error Connecting to database');
      });
  }
}

module.exports = InitiativeService;
