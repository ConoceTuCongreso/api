const express = require('express');

const router = express.router();

router.get('/categories', (req, res) => {
  res.sendStatus(200);
});

router.post('/categories/:categoryId/addToFavorites', (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
