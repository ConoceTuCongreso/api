const DBServices = require('./db');
const CODES = require('../utils/statusCodes');

class CategoryService extends DBServices {
  getCategories() {
    return this.getDB().connect()
      .then((client) => {
        const text = 'SELECT * FROM category_groups';
        return client.query(text)
          .then((result) => {
            this.getLogger().info('Succesful fetch of data for category_groups');
            return { client, categoryGroups: result.rows };
          })
          .catch((e) => {
            client.release();
            this.getLogger().error(`Error executing query: ${e}`);
            throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Internal Server Error');
          });
      })
      .then((clientWithResponse) => {
        const { client, categoryGroups } = clientWithResponse;
        const text = 'SELECT * FROM categories';
        return client.query(text)
          .then((result) => {
            client.release();
            return categoryGroups.reduce((groups, {
              id: groupId,
              name: groupName,
            }) => {
              const categories = result.rows.reduce((acc, {
                id: categoryId, name: categoryName, group_id: categoryWithGroup,
              }) => {
                if (groupId === categoryWithGroup) acc.push({ id: categoryId, name: categoryName });
                return acc;
              }, []);
              groups.push({
                group: groupName,
                categories,
              });
              return groups;
            }, []);
          })
          .catch((e) => {
            this.getLogger().error(`Error executing query: ${e}`);
            client.release();
            throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Internal Server Error');
          });
      })
      .catch((e) => {
        if (e.msg) {
          throw e;
        }
        this.getLogger().error(`Error Connecting to Database: ${e}`);
        throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Internal Server Error');
      });
  }

  getCategoriesFavorites(userId) {
    return this.getDB().connect()
      .then((client) => {
        const query = {
          text: 'SELECT user_categories.category_id AS id, categories.name '
            + 'FROM user_categories '
            + 'LEFT JOIN categories ON categories.id = user_categories.category_id '
            + 'WHERE user_id = $1',
          values: [userId],
        };
        return client.query(query)
          .then((result) => {
            client.release();
            this.getLogger().info(`Successful request for categories of user ${userId}`);
            return result.rows;
          })
          .catch((e) => {
            if (e.msg) {
              throw e;
            }
            client.release();
            this.getLogger().error(`Error excecuting query: ${e}`);
            throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Internal Server Error');
          });
      })
      .catch((e) => {
        if (e.msg) {
          throw e;
        }
        this.getLogger().error(`Error Connecting to Database: ${e}`);
        throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Internal Server Error');
      });
  }

  addCategoryToFavorites(userId, categoryId) {
    return this.getDB().connect()
      .then((client) => {
        const query = {
          text: 'INSERT INTO user_categories(category_id, user_id) VALUES ($1, $2)',
          values: [categoryId, userId],
        };
        return client.query(query)
          .then(() => {
            client.release();
            this.getLogger().info(`Success inserting into user_categories values ${categoryId}, ${userId}`);
          })
          .catch((e) => {
            if (e.msg) {
              throw e;
            }
            client.release();
            this.getLogger().error(`Error excecuting query: ${e}`);
            throw new this.Error(CODES.CONFLICT, 'Category already added');
          });
      })
      .catch((e) => {
        if (e.msg) {
          throw e;
        }
        this.getLogger().error(`Error Connecting to Database: ${e} ${categoryId}`);
        throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Internal Server Error');
      });
  }

  checkCategory(id) {
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
          })
          .catch((e) => {
            if (e.msg) {
              throw e;
            }
            client.release();
            this.getLogger().error(`Error Connecting to Database: ${e}`);
            throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Internal Server Error');
          });
      })
      .catch((e) => {
        if (e.msg) {
          throw e;
        }
        this.getLogger().error(`Error Connecting to Database: ${e}`);
        throw new this.Error(CODES.INTERNAL_SERVER_ERROR, 'Internal Server Error');
      });
  }
}

module.exports = CategoryService;
