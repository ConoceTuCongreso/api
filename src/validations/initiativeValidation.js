const inputValidation = require('./inputValidation');
const CODES = require('../utils/statusCodes');

class InitiativeValidation extends inputValidation {
  constructor() {
    super();
    this.getLogger = this.getLogger.bind(this);
  }

  validateGetIntitiativesByCategory(id) {
    if (!id) {
      this.getLogger().error('Missing ID for category');
      throw new this.Error(CODES.BAD_REQUEST, 'Missing required parameter \'category_id\'');
    }
  }

  validateGetInitiative(id) {
    if (Number.isNaN(+id)) {
      this.getLogger().error('Id given is not a number');
      throw new this.Error(CODES.BAD_REQUEST, 'Request malformation');
    }
  }

  validateSignParameters(params) {
    if (!params.OCR) {
      this.getLogger().error('Missing OCR paramater');
      throw new this.Error(CODES.BAD_REQUEST, 'Missing required parameters');
    }

    if (!params.CIC) {
      this.getLogger().error('Missing CIC paramater');
      throw new this.Error(CODES.BAD_REQUEST, 'Missing required parameters');
    }
  }
}

module.exports = InitiativeValidation;
