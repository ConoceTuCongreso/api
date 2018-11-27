const CODES = require('../utils/statusCodes');

class Categories {
  constructor(logger, categoryService, categoryValidation) {
    this.logger = logger;
    this.categoryService = categoryService;
    this.categoryValidation = categoryValidation;
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

  addCategoryToFavorites(req, res) {
    this.categoryService.checkCategory()
      .then(() => {
        this.categoryService.addCategoryToFavorites(req.params.categoryId)
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
