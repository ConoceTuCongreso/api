const express = require('express');
const bcrypt = require('bcrypt');
const client = require('../database');

const saltRounds = 10;
const router = express.Router();

router.post('/login', (req, res) => {
  client.connect();
  const query = {
    name: 'fetch-user',
    text: 'SELECT password_hash FROM users WHERE username = $1',
    values: [req.body.username],
  };
  client.query(query)
    .then((resq) => {
      bcrypt.compare(req.body.password, resq.rows[0].password_hash).then((resb) => {
        if (resb) {
          res.sendStatus(200);
        }
      })
        .catch((error) => {
          console.log(error);
          res.sendStatus(500);
        });
    })
    .then(() => {
      client.end();
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

router.post('/logout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

router.post('/registro', (req, res) => {
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      res.sendStatus(500);
    }
    bcrypt.hash(req.body.password, salt, (errh, hash) => {
      if (errh) {
        res.sendStatus(500);
      }
      client.connect();
      const query = {
        text: 'INSERT INTO users(first_name, user_id, username, middle_name, last_name, email, password_salt, password_hash) VALUES($1, (SELECT uuid_generate_v1()), $2, $3, $4, $5, $6, $7)',
        values: [req.body.first_name,
          req.body.username,
          req.body.middle_name,
          req.body.last_name,
          req.body.email,
          salt,
          hash],
      };
      client.query(query, (errq) => {
        if (errq) {
          res.sendStatus(500);
        } else {
          client.end();
          req.session.user = {
            username: req.body.username,
            email: req.body.email,
            password: hash,
          };
          res.sendStatus(200);
        }
      });
    });
  });
});

module.exports = router;
