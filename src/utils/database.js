const pg = require('pg');
const fs = require('fs');

const ssl = process.env.SSL_MODE ? {
  rejectUnauthorized: false,
  ca: fs.readFileSync(process.env.CA_POSTGRES).toString(),
  key: fs.readFileSync(process.env.KEY_POSTGRES).toString(),
  cert: fs.readFileSync(process.env.CERT_POSTGRES).toString(),
} : null;

const config = {
  user: process.env.USER_POSTGRES || 'postgres',
  database: process.env.DATABASE_POSTGRES,
  host: process.env.HOST_POSTGRES || 'localhost',
  port: process.env.PORT_POSTGRES || 5432,
  password: process.env.PASSWORD_POSTGRES,
  ssl,
};


const pool = new pg.Pool(config);

module.exports = pool;
