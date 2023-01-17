const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'faredata.c1rgmh92t4a4.us-east-1.rds.amazonaws.com',
  port: 5432,
  database: 'postgres',
})

module.exports = pool
