const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const http = require('http');

const usersRouter = require('./routes/usuario');

const app = express();

app.set('port', 3000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  key: 'user_sid',
  secret: process.env.CTC_SESSION,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000,
  },
}));
app.use(`/${process.env.PATH_PREFIX || ''}`, usersRouter);
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});

const server = http.createServer(app);

server.listen(app.get('port'));
