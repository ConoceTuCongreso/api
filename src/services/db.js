const db = require('../utils/database');
const Logger = require('../utils/logger');
const Error = require('../errors/statusError');

const logger = new Logger();

class DBService {
  constructor() {
    this.init();
  }

  init() {
    this.db = db;
    this.logger = logger;
    this.Error = Error;
  }

  getDB() {
    return this.db;
  }

  getLogger() {
    return this.logger;
  }
}

module.exports = DBService;
