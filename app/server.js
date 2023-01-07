const express = require('express')
const app = express()
const cors = require('cors')
const pool = require('./db')

app.use(cors())
app.use(express.json())

app.get('/:city', async (req, res) => {
    try {
        const { city } = req.params
        const data = await pool.query(
            `SELECT * FROM taxifares WHERE city = '${city}';`
        )
        res.json(data.rows)
    } catch (err) {
        console.error(err.message)
    }
})

app.listen(5000, () => {
    console.log('Server has started on port 5000')
})
