const DBServices = require('./db');
const CODES = require('../utils/statusCodes');

class InitiativeService extends DBServices {
  getInitiatives(categoryId) {
    let snippetOfQueryForCategory = '';
    if (categoryId) {
      this.getLogger().info(`Search with category id ${categoryId}`);
      snippetOfQueryForCategory = 'LEFT JOIN initiatives_categories On initiatives.id = initiatives_categories.initiatives_id WHERE initiatives_categories.category_id = $1 ';
    }
    return this.getDB().connect()
      .then((client) => {
        const query = {
          text: 'SELECT initiatives.id, initiatives.description, initiative_status.name AS status, initiatives.document_url, initiatives.author, initiatives.infolej_number, initiatives.agreement_number '
            + 'FROM initiatives '
            + `LEFT JOIN initiative_status ON initiative_status.id = initiatives.status_id ${snippetOfQueryForCategory}`,
          values: [categoryId],
        };
        return client.query(query)
          .then((result) => {
            client.release();
            this.getLogger().info('Query successful');
            return result.rows;
          })
          .catch((e) => {
            if (e.msg) {
              throw e;
            }
            client.release();
            this.getLogger().error(`Internal Server Error: ${e}`);
            throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Internal Server Error');
          });
      })
      .catch((e) => {
        if (e.msg) {
          throw e;
        }
        this.getLogger().error(`Internal Server Error: ${e}`);
        throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Internal Server Error');
      });
  }

  getInitiativeById(id) {
    return this.getDB().connect()
      .then((client) => {
        const query = {
          text: 'SELECT initiatives.id, initiatives.description, initiative_status.name AS status, initiatives.document_url, initiatives.author, initiatives.infolej_number, initiatives.agreement_number '
            + 'FROM initiatives '
            + 'LEFT JOIN initiative_status ON initiative_status.id = initiatives.status_id '
            + 'WHERE initiatives.id = $1',
          values: [id],
        };
        return client.query(query)
          .then((result) => {
            if (result.rows.length < 1) {
              throw new this.Error(CODES.NOT_FOUND, `Initiative with ID ${id} not found`);
            }
            client.release();
            return result.rows[0];
          })
          .catch((e) => {
            client.release();
            if (e.msg) {
              this.getLogger().error(e.msg);
              throw e;
            }
            this.getLogger().error(e);
            throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Error retrieving data');
          });
      })
      .catch((e) => {
        if (!e.msg) {
          this.getLogger().error('Error Connecting to database');
          throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Error Connecting to database');
        }
        throw e;
      });
  }

  getInitiativeVotes(id) {
    return this.getDB().connect()
      .then((client) => {
        const query = {
          text: 'SELECT initiative_votes.initiative_id, initiative_votes.congressperson_id, congresspeople.name, vote_values.name '
            + 'FROM initiative_votes '
            + 'LEFT JOIN vote_values ON initiative_votes.value_id = vote_values.id '
            + 'LEFT JOIN congresspeople ON initiative_votes.congressperson_id = congresspeople.id '
            + 'WHERE initiative_votes.initiative_id = $1 '
            + 'ORDER BY congressperson_id',
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
            throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Error Connecting to database');
          });
      })
      .catch(() => {
        this.getLogger().error('Error Connecting to database');
        throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Error Connecting to database');
      });
  }

  addToFavorites(userId, initiativeId) {
    return this.getDB().connect()
      .then((client) => {
        const text = 'INSERT INTO user_favorites(user_id, initiative_id) VALUES($1, $2) RETURNING *';
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
            throw new this.Error(CODES.CONFLICT, 'Favorite already added');
          });
      })
      .catch((e) => {
        if (!e.msg) {
          this.getLogger().error(`Error Connecting to database ${e}`);
          throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Error Connecting to database');
        }
        throw e;
      });
  }

  vote(params) {
    return this.getDB().connect()
      .then((client) => {
        const query = {
          text: 'INSERT INTO signatures(initiative_id, "CIC", "OCR") VALUES($1, $2, $3) RETURNING *',
          values: [params.initiative_id, params.CIC, params.OCR],
        };
        return client.query(query)
          .then((result) => {
            client.release();
            this.getLogger(result.rows[0]);
            return result;
          })
          .catch((e) => {
            client.release();
            this.getLogger().error(`Request to insert failed. ${e}`);
            throw new this.Error(CODES.CONFLICT, 'Initiative already signed with that INE');
          });
      })
      .catch((e) => {
        if (!e.msg) {
          this.getLogger().error('Error Connecting to database');
          throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Error Connecting to database');
        }
        throw e;
      });
  }

  validateInitiative(id) {
    return this.getInitiativeById(id)
      .catch((e) => {
        throw e;
      });
  }

  validateCategory(id) {
    return this.getDB().connect()
      .then((client) => {
        const query = {
          text: 'SELECT id FROM categories WHERE id = $1',
          values: [id],
        };
        return client.query(query)
          .then((result) => {
            client.release();
            if (result.rows.length < 1) {
              this.getLogger().error(`Category with ID ${id} not found`);
              throw new this.Error(CODES.NOT_FOUND, `Category with ID ${id} not found`);
            }
            this.getLogger().info(`Category with ID ${id} found`);
          })
          .catch((e) => {
            if (e.msg) {
              throw e;
            }
            this.getLogger().error(`Internal Server Error: ${e}`);
            throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Internal Server Error');
          });
      })
      .catch((e) => {
        if (e.msg) {
          throw e;
        }
        this.getLogger().error(`Internal Server Error: ${e}`);
        throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Internal Server Error');
      });
  }
}

module.exports = InitiativeService;
