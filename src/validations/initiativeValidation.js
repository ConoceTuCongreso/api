const inputValidation = require('./inputValidation');

class InitiativeValidation extends inputValidation {
  constructor() {
    super();
    this.getLogger = this.getLogger.bind(this);
  }

  validateAddToFavorites(initiativeId) {
    this.getLogger.info(initiativeId);
  }

  validateSign(params) {
    this.getLogger.info(params);
  }
}

module.exports = InitiativeValidation;
