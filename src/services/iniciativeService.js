const DBServices = require('./db');
const CODES = require('../utils/statusCodes');

class InitiativeService extends DBServices {
  getInitiatives(categoryId) {
    return this.getDB().connect()
      .then((client) => {
        const query = {
          text: 'SELECT initiative_status_dates.initiative_id AS id, to_char(status_date, \'YYYY-MM-DD\') AS date, status_conditions.name AS condition, initiative_status.name AS status '
            + 'FROM initiative_status_dates '
            + 'LEFT JOIN initiative_status ON initiative_status.id = initiative_status_dates.status_id '
            + 'LEFT JOIN status_conditions ON initiative_status_dates.status_condition = status_conditions.id '
            + 'LEFT JOIN initiatives_categories ON initiatives_categories.initiatives_id = initiative_status_dates.initiative_id '
            + 'WHERE initiatives_categories.category_id = $1',
          values: [categoryId],
        };
        return client.query(query)
          .then((result) => {
            this.getLogger().info('Successful fetching of data of dates');
            return { client, datesOfInitiatives: result.rows };
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
      .then((clientWithResponse) => {
        const { client, datesOfInitiatives } = clientWithResponse;
        const query = {
          text: 'SELECT initiatives.id, initiatives.description, initiative_status.name AS status, initiatives.document_url, initiatives.author, initiatives.infolej_number, initiatives.agreement_number '
            + 'FROM initiatives '
            + 'LEFT JOIN initiative_status ON initiative_status.id = initiatives.status_id '
            + 'LEFT JOIN initiatives_categories On initiatives.id = initiatives_categories.initiatives_id '
            + 'WHERE initiatives_categories.category_id = $1',
          values: [categoryId],
        };
        return client.query(query)
          .then((result) => {
            client.release();
            this.getLogger().info('Query successful');
            return result.rows.reduce((initiativesFromCategory, {
              id: initiativeId,
              description,
              status: initiativeStatus,
              document_url: doc,
              author,
              infolej_number: infoNum,
              agreement_number: agreeNum,
            }) => {
              const dates = datesOfInitiatives.reduce((acc, {
                id, date, status, condition,
              }) => {
                if (initiativeId === id) acc.push({ date, status, condition });
                return acc;
              }, []);
              initiativesFromCategory.push({
                id: initiativeId,
                description,
                status: initiativeStatus,
                document_url: doc,
                author,
                infolej_number: infoNum,
                agreement_number: agreeNum,
                dates,
              });
              return initiativesFromCategory;
            }, []);
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

  getInitiativeById(ID) {
    return this.getDB().connect()
      .then((client) => {
        const query = {
          text: 'SELECT initiative_status_dates.initiative_id AS id, to_char(status_date, \'YYYY-MM-DD\') AS date, status_conditions.name AS condition, initiative_status.name AS status '
            + 'FROM initiative_status_dates '
            + 'LEFT JOIN initiative_status ON initiative_status.id = initiative_status_dates.status_id '
            + 'LEFT JOIN status_conditions ON initiative_status_dates.status_condition = status_conditions.id '
            + 'WHERE initiative_status_dates.initiative_id = $1',
          values: [ID],
        };
        return client.query(query)
          .then((result) => {
            this.getLogger().info('Successful fetching of data of dates');
            return { client, datesOfInitiative: result.rows };
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
      .then((clientWithResponse) => {
        const { client, datesOfInitiative } = clientWithResponse;
        const query = {
          text: 'SELECT initiatives.id, initiatives.description, initiative_status.name AS status, initiatives.document_url, initiatives.author, initiatives.infolej_number, initiatives.agreement_number '
            + 'FROM initiatives '
            + 'LEFT JOIN initiative_status ON initiative_status.id = initiatives.status_id '
            + 'WHERE initiatives.id = $1',
          values: [ID],
        };
        return client.query(query)
          .then((result) => {
            if (result.rows.length < 1) {
              throw new this.Error(CODES.NOT_FOUND, `Initiative with ID ${ID} not found`);
            }
            client.release();
            return result.rows.reduce((initiativeById, {
              id: initiativeId,
              description,
              status: initiativeStatus,
              document_url: doc,
              author,
              infolej_number: infoNum,
              agreement_number: agreeNum,
            }) => {
              const dates = datesOfInitiative.reduce((acc, {
                id, date, status, condition,
              }) => {
                if (initiativeId === id) acc.push({ date, status, condition });
                return acc;
              }, []);
              initiativeById.push({
                id: initiativeId,
                description,
                status: initiativeStatus,
                document_url: doc,
                author,
                infolej_number: infoNum,
                agreement_number: agreeNum,
                dates,
              });
              return initiativeById;
            }, [])[0];
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
        const text = 'SELECT name FROM vote_values';
        return client.query(text)
          .then((result) => {
            this.getLogger().info(`Retrieve of vote values succesful ${result.rows}`);
            return { client, voteValues: result.rows };
          })
          .catch(() => {
            client.release();
            this.getLogger().error('Query was a no no');
            throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Error Connecting to database');
          });
      })
      .then((clientWithResponse) => {
        const { client, voteValues } = clientWithResponse;
        const query = {
          text: 'SELECT congresspeople.name as name, vote_values.name as value '
            + 'FROM initiative_votes '
            + 'LEFT JOIN vote_values ON initiative_votes.value_id = vote_values.id '
            + 'LEFT JOIN congresspeople ON initiative_votes.congressperson_id = congresspeople.id '
            + 'WHERE initiative_votes.initiative_id = $1 '
            + 'ORDER BY initiative_votes.value_id, congresspeople.name ASC',
          values: [id],
        };
        return client.query(query)
          .then((result) => {
            client.release();
            return voteValues.reduce((currentVotes, { name: voteValue }) => {
              const congresspeople = result.rows.reduce((acc, { name, value }) => {
                if (value === voteValue) acc.push(name);
                return acc;
              }, []);
              currentVotes.push({ value: voteValue, congresspeople });
              return currentVotes;
            }, []);
          })
          .catch((e) => {
            this.getLogger().error(e);
            client.release();
            throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Error Connecting to database');
          });
      })
      .catch(() => {
        this.getLogger().error('Error Connecting to database');
        throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Error Connecting to database');
      });
  }

  getInitiativesFavorites(userId) {
    return this.getDB().connect()
      .then((client) => {
        const query = {
          text: 'SELECT initiative_status_dates.initiative_id AS id, to_char(status_date, \'YYYY-MM-DD\') AS date, status_conditions.name AS condition, initiative_status.name AS status '
            + 'FROM initiative_status_dates '
            + 'LEFT JOIN initiative_status ON initiative_status.id = initiative_status_dates.status_id '
            + 'LEFT JOIN status_conditions ON initiative_status_dates.status_condition = status_conditions.id '
            + 'LEFT JOIN user_favorites ON initiative_status_dates.initiative_id = user_favorites.initiative_id '
            + 'WHERE user_favorites.user_id = $1',
          values: [userId],
        };
        return client.query(query)
          .then((result) => {
            this.getLogger().info('Successful fetching of data of dates');
            return { client, datesOfInitiatives: result.rows };
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
      .then((clientWithResponse) => {
        const { client, datesOfInitiatives } = clientWithResponse;
        const query = {
          text: 'SELECT initiatives.id, initiatives.description, initiative_status.name AS status, initiatives.document_url, initiatives.author, initiatives.infolej_number, initiatives.agreement_number '
            + 'FROM user_favorites '
            + 'LEFT JOIN initiatives ON initiatives.id = user_favorites.initiative_id '
            + 'LEFT JOIN initiative_status ON initiative_status.id = initiatives.status_id '
            + 'WHERE user_favorites.user_id = $1',
          values: [userId],
        };
        return client.query(query)
          .then((result) => {
            client.release();
            this.getLogger().info(`Result of query ${result.rows}`);
            return result.rows.reduce((initiativesFromCategory, {
              id: initiativeId,
              description,
              status: initiativeStatus,
              document_url: doc,
              author,
              infolej_number: infoNum,
              agreement_number: agreeNum,
            }) => {
              const dates = datesOfInitiatives.reduce((acc, {
                id, date, status, condition,
              }) => {
                if (initiativeId === id) acc.push({ date, status, condition });
                return acc;
              }, []);
              initiativesFromCategory.push({
                id: initiativeId,
                description,
                status: initiativeStatus,
                document_url: doc,
                author,
                infolej_number: infoNum,
                agreement_number: agreeNum,
                dates,
              });
              return initiativesFromCategory;
            }, []);
          })
          .catch((e) => {
            if (e.msg) {
              throw e;
            }
            client.release();
            this.getLogger().error(`Error Connecting to database ${e}`);
            throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Error Connecting to database');
          });
      })
      .catch((e) => {
        if (e.msg) {
          throw e;
        }
        this.getLogger().error(`Error Connecting to database ${e}`);
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
