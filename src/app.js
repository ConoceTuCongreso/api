const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const http = require('http');
const env = require('dotenv');

const usersRouter = require('./routes/users');
const initiativesRouter = require('./routes/initiative');

if (process.env.NODE_ENV === 'test') {
  env.config();
} else if (process.env.NODE_ENV === 'dev') {
  env.config({ path: '/home/drag/Documents/semestrei' });
}

const app = express();

app.set('port', 3000);

app.use(cors());

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
app.use((req, res, next) => {
  res.removeHeader('Transfer-Encoding');
  res.removeHeader('X-Powered-By');
  next();
});
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});
app.use(`/${process.env.PATH_PREFIX || ''}`, usersRouter);
app.use(`/${process.env.PATH_PREFIX || ''}`, initiativesRouter);

const server = http.createServer(app);

server.listen(app.get('port'));
