const express = require('express');

const router = express.Router();

router.get('/propuestas', (req, res) => {
  res.sendStatus(200);
});

router.get('/propuestas/:propuestaId', (req, res) => {
  res.sendStatus(200);
});

router.get('/propuestas/firmas', (req, res) => {
  res.sendStatus(200);
});

router.get('/propuestas/condicion', (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
