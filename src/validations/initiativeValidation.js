const inputValidation = require('./inputValidation');

class InitiativeValidation extends inputValidation {
  constructor() {
    super();
    this.getLogger = this.getLogger.bind(this);
  }

  validateAddToFavorites(params) {
    this.getLogger.info(params);
  }

  validateSign(params) {
    this.getLogger.info(params);
  }
}

module.exports = InitiativeValidation;
