const pg = require('pg');
const fs = require('fs');

const config = {
  user: process.env.USER_POSTGRES || 'postgres',
  database: process.env.DATABASE_POSTGRES,
<<<<<<< HEAD
  host: process.env.HOST_POSTGRES || 'localhost',
  port: process.env.PORT_POSTGRES || 5432,
=======
  host: 'localHost',
  port: process.env.PORT_POSTGRES,
>>>>>>> Added rough implementation of logging through winston
  password: process.env.PASSWORD_POSTGRES,
  ssl: {
    rejectUnauthorized: false,
    ca: fs.readFileSync(process.env.CA_POSTGRES).toString(),
    key: fs.readFileSync(process.env.KEY_POSTGRES).toString(),
    cert: fs.readFileSync(process.env.CERT_POSTGRES).toString(),
  },
};

const pool = new pg.Pool(config);

module.exports = pool;
