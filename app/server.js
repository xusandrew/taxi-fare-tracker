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

app.get('/citylist/:text', async (req, res) => {
  /* Get list of cities that names match the input.
  Empty input returns all cities.*/

  try {
    let { text } = req.params
    text = format(text)

    let query
    if (text === '-') {
      query = `SELECT city FROM cities ORDER BY city;`
    } else {
      query = `SELECT city FROM cities WHERE city LIKE '${text}%' ORDER BY city;`
    }

    const data = await pool.query(query)
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
    let data = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public';"
    )
    res.json(data)
  } catch (err) {
    console.error(err)
  }
})

app.listen(5000, () => {
  console.log('Server has started on port 5000')
})
