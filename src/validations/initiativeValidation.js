const inputValidation = require('./inputValidation');

class InitiativeValidation extends inputValidation {
  constructor() {
    super();
    this.getLogger = this.getLogger.bind(this);
  }

  validateGetInitiatives() {
    this.getLogger.info('TODO');
  }
}

module.exports = InitiativeValidation;
