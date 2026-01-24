const { Pool } = require('pg');

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "moviehub",
  password: "postgres", // wpisz swoje hasło
  port: 5432,
});

module.exports = pool;
