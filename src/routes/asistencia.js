const express = require('express');

const router = express.router();

router.get('/asistencias/:diputadoId', (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
