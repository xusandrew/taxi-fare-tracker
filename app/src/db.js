const Pool = require('pg').Pool
const pool = new Pool({
    user: 'andrew',
    password: '',
    host: 'localhost',
    port: 5432,
    database: 'taxifaretracker',
})

module.exports = pool
