const express = require('express');
const Logger = require('../utils/logger');
const CategoryService = require('../services/categoryService');
const CategoriesController = require('../controllers/category');
const sessionChecker = require('../middleware/sessionChecker');

const router = express.Router();

const logger = new Logger();
const categoryService = new CategoryService();
const categoriesController = new CategoriesController(
  logger,
  categoryService,
);

router.get('/categories', categoriesController.getCategories);

router.get('/categories/favorite', sessionChecker, categoriesController.getCategoriesFavorites);

router.post('/categories/:categoryId/addToFavorites', sessionChecker, categoriesController.addCategoryToFavorites);

module.exports = router;
