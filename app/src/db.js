const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'postgres',
  port: 5432,
  database: 'postgres',
})

module.exports = pool
