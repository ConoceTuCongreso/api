const db = require('../utils/database');
const Logger = require('../utils/logger');

const logger = new Logger();

class Interactor {
  constructor() {
    this.init();
  }

  init() {
    this.db = db;
    this.logger = logger;
  }

  getDB() {
    return this.db;
  }

  getLogger() {
    return this.logger;
  }
}

module.exports = Interactor;
