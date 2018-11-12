const DBServices = require('./db');

class InitiativeService extends DBServices {
  getInitiatives() {
    return this.db.connect()
      .then((client) => {
        const text = 'SELECT * FROM initiatives';
        return client.query(text)
          .then((result) => {
            client.release();
            return result.rows;
          })
          .catch(() => {
            this.getLogger('Query was a no no');
            throw new this.Error(500, 'Error Connecting to database');
          });
      })
      .catch(() => {
        this.getLogger('Error Connecting to database');
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
            console.log(result);
            
            client.release();
            return result.rows;
          })
          .catch(() => {
            this.getLogger('Query was a no no');
            throw new this.Error(500, 'Error Connecting to database');
          });
      })
      .catch(() => {
        this.getLogger('Error Connecting to database');
        throw new this.Error(500, 'Error Connecting to database');
      });
  }

  getInitiativeVotes(id) {
    return this.db.connect()
      .then((client) => {
        const query = {
          text: 'SELECT * FROM votes WHERE initiative = $1',
          values: id,
        };
        client.query(query)
          .then((result) => {
            client.release();
            return result.rows;
          })
          .catch(() => {
            this.getLogger('Query was a no no');
            throw new this.Error(500, 'Error Connecting to database');
          });
      })
      .catch(() => {
        this.getLogger('Error Connecting to database');
        throw new this.Error(500, 'Error Connecting to database');
      });
  }

  addToFavorites(userId, initiativeId) {
    return this.db.connect()
      .then((client) => {
        const query = {
          text: 'INSERT INTO favorites(user_id, initiative_id) VALUES($1, $2)',
          values: [userId, initiativeId],
        };
        client.query(query)
          .catch(() => {
            this.getLogger('Query was a no no');
            throw new this.Error(500, 'Error Connecting to database');
          });
      })
      .catch(() => {
        this.getLogger('Error Connecting to database');
        throw new this.Error(500, 'Error Connecting to database');
      });
  }

  vote(params) {
    return this.db.connect()
      .then((client) => {
        const query = {
          text: 'INSERT INTO signatures(initiative, CIC, OCR) VALUES($1, $2, $3)',
          values: [params.initiative_id, params.CIC, params.OCR],
        };
        client.query(query)
          .catch(() => {
            this.getLogger('Query was a no no');
            throw new this.Error(500, 'Error Connecting to database');
          });
      })
      .catch(() => {
        this.getLogger('Error Connecting to database');
        throw new this.Error(500, 'Error Connecting to database');
      });
  }
}

module.exports = InitiativeService;
