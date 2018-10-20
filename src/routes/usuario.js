const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../utils/database');

const saltRounds = 10;
const router = express.Router();

router.post('/login', (req, res) => {
  (async () => {
    const client = await pool.connect();
    try {
      const resq = await client.query('SELECT password_hash FROM users WHERE username = $1', [req.body.username]);
      const match = await bcrypt.compare(req.body.password, resq.rows[0].password_hash);
      if (match) {
        req.session.user = {
          username: req.body.username,
          email: req.body.email,
          password: resq.rows[0].password_hash,
        };
        res.sendStatus(200);
      } else {
        res.sendStatus(400);
      }
    } finally {
      client.release();
    }
  })().catch(() => res.sendStatus(500));
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
  (async () => {
    const client = await pool.connect();
    try {
      const checkUsernameExist = await client.query('SELECT username FROM users WHERE username = $1', [req.body.username]);
      if (checkUsernameExist.rows.length === 0) {
        res.send(`${req.body.username} already taken.`);
      } else {
        bcrypt.genSalt(saltRounds, (err, salt) => {
          if (err) {
            res.sendStatus(500);
          }
          bcrypt.hash(req.body.password, salt, (errh, hash) => {
            if (errh) {
              res.sendStatus(500);
            }
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
                pool.end();
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
      }
    } finally {
      client.release();
    }
  })().catch(() => res.sendStatus(500));
});

module.exports = router;
