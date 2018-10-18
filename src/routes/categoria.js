const express = require('express');

const router = express.router();

router.get('/categorias', (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
