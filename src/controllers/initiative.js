class Initiatives {
  constructor(logger, initiativeService) {
    this.logger = logger;
    this.initiativeService = initiativeService;
  }

  initiatives(req, res) {
    this.iniciativeService.getInitiatives()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((e) => {
        res.status(e.code).send(e.msg);
      });
  }

  initiativeById(req, res) {
    this.iniciativeService.getInitiativesById(req.params.initiativeId)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((e) => {
        res.status(e.code).send(e.msg);
      });
  }

  initiativeVotes(req, res) {
    this.iniciativeService.getInitiativeVotes(req.params.initiativeId)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((e) => {
        res.status(e.code).send(e.msg);
      });
  }
}

module.exports = Initiatives;
