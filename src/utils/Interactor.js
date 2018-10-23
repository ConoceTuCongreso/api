const db = require('./database');

class Interactor {
  constructor() {
    this.init();
  }

  init() {
    this.db = db;
  }

  getDB() {
    return this.db;
  }
}

module.exports = Interactor;
