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
          values: [id],
        };
        return client.query(query)
          .then((result) => {
            client.release();
            return result.rows[0];
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
          text: 'SELECT votes.initiative, votes.congressperson, congresspeople.congressperson_name, vote_values.initiative_value '
            + 'FROM votes '
            + 'LEFT JOIN vote_values ON votes.value_id = vote_values.value_id '
            + 'LEFT JOIN congresspeople ON votes.congressperson = congresspeople.congressperson_id '
            + 'WHERE votes.initiative = $1 '
            + 'ORDER BY votes.congressperson',
          values: [id],
        };
        return client.query(query)
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
          text: 'INSERT INTO favorites(user_id, initiative_id) VALUES($1, $2) RETURNING *',
          values: [userId, initiativeId],
        };
        return client.query(query)
          .then((result) => {
            client.release();
            return result;
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
