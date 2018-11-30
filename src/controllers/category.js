const CODES = require('../utils/statusCodes');

class Categories {
  constructor(logger, categoryService) {
    this.logger = logger;
    this.categoryService = categoryService;

    this.getCategories = this.getCategories.bind(this);
    this.getCategoriesFavorites = this.getCategoriesFavorites.bind(this);
    this.addCategoryToFavorites = this.addCategoryToFavorites.bind(this);
  }

  getCategories(req, res) {
    this.categoryService.getCategories()
      .then((result) => {
        res.status(CODES.OK).send(result);
      })
      .catch((e) => {
        res.status(e.code).send(e.msg);
      });
  }

  getCategoriesFavorites(req, res) {
    this.categoryService.getCategoriesFavorites(req.session.user.id)
      .then((result) => {
        res.status(CODES.OK).send(result);
      })
      .catch((e) => {
        res.status(e.code).send(e.msg);
      });
  }

  addCategoryToFavorites(req, res) {
    this.categoryService.checkCategory(req.params.categoryId)
      .then(() => {
        this.categoryService.addCategoryToFavorites(req.session.user.id, req.params.categoryId)
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

module.exports = Categories;
