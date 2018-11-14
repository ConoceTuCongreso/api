const DBServices = require('./db');

class InitiativeService extends DBServices {
  getInitiatives() {
    return this.getDB().connect()
      .then((client) => {
        const text = 'SELECT * FROM initiatives';
        return client.query(text)
          .then((result) => {
            client.release();
            return result.rows;
          })
          .catch(() => {
            client.release();
            this.getLogger().error(`Select query ${text} did not work`);
            throw new this.Error(500, 'Error Connecting to database');
          });
      })
      .catch(() => {
        this.getLogger().error('Error Connecting to database');
        throw new this.Error(500, 'Error Connecting to database');
      });
  }

  getInitiativeById(id) {
    return this.getDB().connect()
      .then((client) => {
        const query = {
          text: 'SELECT * FROM initiatives WHERE initiative_id = $1',
          values: [id],
        };
        return client.query(query)
          .then((result) => {
            if (result.rows.length < 1) {
              throw new this.Error(500, 'No initiative found with that id');
            }
            client.release();
            return result.rows[0];
          })
          .catch((e) => {
            client.release();
            if (e.code) {
              this.getLogger().error(e.msg);
              throw e;
            }
            this.getLogger().error(e);
            throw new this.Error(500, 'Error retrieving data');
          });
      })
      .catch((e) => {
        if (!e.code) {
          this.getLogger().error('Error Connecting to database');
          throw new this.Error(500, 'Error Connecting to database');
        }
        throw e;
      });
  }

  getInitiativeVotes(id) {
    return this.getDB().connect()
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
            client.release();
            this.getLogger().error('Query was a no no');
            throw new this.Error(500, 'Error Connecting to database');
          });
      })
      .catch(() => {
        this.getLogger().error('Error Connecting to database');
        throw new this.Error(500, 'Error Connecting to database');
      });
  }

  addToFavorites(userId, initiativeId) {
    return this.getDB().connect()
      .then((client) => {
        const text = 'INSERT INTO favorites(user_id, initiative_id) VALUES($1, $2) RETURNING *';
        const values = [userId, initiativeId];
        return client.query(text, values)
          .then((result) => {
            client.release();
            this.getLogger(result.rows[0]);
            return result;
          })
          .catch((e) => {
            client.release();
            this.getLogger().error(`Request to insert failed. ${e}`);
            throw new this.Error(500, 'Favorite already added');
          });
      })
      .catch((e) => {
        if (!e.code) {
          this.getLogger().error(`Error Connecting to database ${e}`);
          throw new this.Error(500, 'Error Connecting to database');
        }
        throw e;
      });
  }

  vote(params) {
    return this.getDB().connect()
      .then((client) => {
        const query = {
          text: 'INSERT INTO signatures(initiative, CIC, OCR) VALUES($1, $2, $3) RETURNING *',
          values: [params.initiative_id, params.CIC, params.OCR],
        };
        client.query(query)
          .then((result) => {
            client.release();
            this.getLogger(result.rows[0]);
            return result;
          })
          .catch((e) => {
            client.release();
            this.getLogger().error(`Request to insert failed. ${e}`);
            throw new this.Error(500, 'Initiative signed already');
          });
      })
      .catch(() => {
        this.getLogger().error('Error Connecting to database');
        throw new this.Error(500, 'Error Connecting to database');
      });
  }

  validateInitiative(id) {
    return this.getInitiativeById(id)
      .catch((e) => {
        throw e;
      });
  }
}

module.exports = InitiativeService;
