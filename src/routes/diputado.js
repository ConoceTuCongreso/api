const express = require('express');

const router = express.Router();

router.get('/diputados', (req, res) => {
  res.sendStatus(200);
});

router.get('/diputados/:diputadoId', (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
