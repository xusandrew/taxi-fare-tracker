const express = require('express')
const app = express()
const cors = require('cors')
const pool = require('./src/db')

app.use(cors())
app.use(express.json())

const format = text => {
  text = text.toLowerCase()
  return text.charAt(0).toUpperCase() + text.slice(1)
}

app.get('/citylist', async (req, res) => {
  /* Get list of cities that are in the database */
  try {
    let query = `SELECT city FROM cities ORDER BY city;`

    console.log('Getting Data')
    const data = await pool.query(query)
    console.log('Got Data')
    res.json(data.rows)
  } catch (err) {
    console.error(err.message)
  }
})

app.get('/routes/:city', async (req, res) => {
  /* Return route data for uber/lyft rides */

  try {
    let { city } = req.params
    city = format(city)

    response = {}
    let query = `SELECT * FROM uberfares WHERE city='${city}'`
    let uber_data = await pool.query(query)
    uber_data = uber_data.rows
    response['uber'] = uber_data

    query = `SELECT * FROM lyftfares WHERE city='${city}'`
    let lyft_data = await pool.query(query)
    lyft_data = lyft_data.rows
    response['lyft'] = lyft_data

    res.json(response)
  } catch (err) {
    console.error(err)
  }
})

app.get('/taxi/:city', async (req, res) => {
  /* Return route data for taxi rides */
  try {
    let { city } = req.params
    city = format(city)

    let query = `SELECT * FROM taxifares WHERE city='${city}';`
    let data = await pool.query(query)
    data = data.rows

    if (!data) {
      res.json('')
    }

    res.json(data)
  } catch (err) {
    console.error(err.message)
  }
})

app.get('/', async (req, res) => {
  try {
    res.send('Hello!')
  } catch (err) {
    console.error(err)
  }
})

app.listen(5000, () => {
  console.log('Server has started on port 5000')
})
