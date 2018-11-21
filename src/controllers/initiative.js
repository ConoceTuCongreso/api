const CODES = require('../utils/statusCodes');

class Initiatives {
  constructor(logger, initiativeService, initiativeValidation) {
    this.logger = logger;
    this.initiativeService = initiativeService;
    this.initiativeValidation = initiativeValidation;

    this.initiatives = this.initiatives.bind(this);
    this.initiativeById = this.initiativeById.bind(this);
    this.initiativeVotes = this.initiativeVotes.bind(this);
    this.addToFavorites = this.addToFavorites.bind(this);
    this.sign = this.sign.bind(this);
  }

  initiatives(req, res) {
    try {
      this.initiativeValidation.validateGetIntitiativesByCategory(req.query.category_id);
    } catch (e) {
      res.status(e.code).send(e.msg);
      return;
    }
    this.initiativeService.validateCategory(req.query.category_id)
      .then(() => {
        this.initiativeService.getInitiatives(req.query.category_id)
          .then((result) => {
            res.status(CODES.OK).send(result);
          })
          .catch((e) => {
            res.status(e.code).send(e.msg);
          });
      })
      .catch((e) => {
        res.status(e.code).send(e.msg);
      });
  }

  initiativeById(req, res) {
    try {
      this.initiativeValidation.validateGetInitiative(req.params.initiativeId);
    } catch (e) {
      res.status(e.code).send(e.msg);
      return;
    }
    this.initiativeService.getInitiativeById(req.params.initiativeId)
      .then((result) => {
        res.status(CODES.OK).send(result);
      })
      .catch((e) => {
        res.status(e.code).send(e.msg);
      });
  }

  initiativeVotes(req, res) {
    try {
      this.initiativeValidation.validateGetInitiative(req.params.initiativeId);
    } catch (e) {
      res.status(e.code).send(e.msg);
      return;
    }
    this.initiativeService.validateInitiative(req.params.initiativeId)
      .then(() => {
        this.initiativeService.getInitiativeVotes(req.params.initiativeId)
          .then((result) => {
            res.status(CODES.OK).send(result);
          })
          .catch((e) => {
            res.status(e.code).send(e.msg);
          });
      })
      .catch((e) => {
        res.status(e.code).send(e.msg);
      });
  }

  addToFavorites(req, res) {
    try {
      this.initiativeValidation.validateGetInitiative(req.params.initiativeId);
    } catch (e) {
      res.status(e.code).send(e.msg);
      return;
    }
    this.initiativeService.validateInitiative(req.params.initiativeId)
      .then(() => {
        this.initiativeService.addToFavorites(req.session.user.id, req.params.initiativeId)
          .then(() => {
            res.status(CODES.OK).send('OK');
          })
          .catch((e) => {
            res.status(e.code).send(e.msg);
          });
      })
      .catch((e) => {
        res.status(e.code).send(e.msg);
      });
  }

  sign(req, res) {
    try {
      this.initiativeValidation.validateGetInitiative(req.params.initiativeId);
      this.initiativeValidation.validateSignParameters(req.query);
    } catch (e) {
      res.status(e.code).send(e.msg);
      return;
    }
    const params = {
      initiative_id: req.params.initiativeId,
      CIC: req.query.CIC,
      OCR: req.query.OCR,
    };
    this.initiativeService.validateInitiative(params.initiative_id)
      .then(() => {
        this.initiativeService.vote(params)
          .then(() => {
            res.status(CODES.OK).send('OK');
          })
          .catch((e) => {
            res.status(e.code).send(e.msg);
          });
      })
      .catch((e) => {
        res.status(e.code).send(e.msg);
      });
  }
}

module.exports = Initiatives;
