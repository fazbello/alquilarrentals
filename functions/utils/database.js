// netlify/functions/utils/database.js
const knex = require('knex');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './database.sqlite'
  },
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = 
ON', cb);
    }
  }
});

module.exports = db;
