require('dotenv').config();

const knex = require('knex')({
  client: 'pg',
  version: '9.6',
  connection: {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
  },
  pool: { min: 0, max: 7 }
});

module.exports = knex;
