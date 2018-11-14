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
    this.initiativeService.getInitiatives()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((e) => {
        res.status(e.code).send(e.msg);
      });
  }

  initiativeById(req, res) {
    this.initiativeService.getInitiativeById(req.params.initiativeId)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((e) => {
        res.status(e.code).send(e.msg);
      });
  }

  initiativeVotes(req, res) {
    this.initiativeService.validateInitiative(req.params.initiativeId)
      .then(() => {
        this.initiativeService.getInitiativeVotes(req.params.initiativeId)
          .then((result) => {
            res.status(200).send(result);
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
    this.initiativeService.validateInitiative(req.params.initiativeId)
      .then(() => {
        this.initiativeService.addToFavorites(req.session.user.id, req.params.initiativeId)
          .then(() => {
            res.status(200).send('OK');
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
    this.initiativeService.validateInitiative(req.params.initiativeId)
      .then(() => {
        this.initiativeService.vote(req.params)
          .then(() => {
            res.status(200).send('OK');
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
