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
  try {
    let { text } = req.params
    text = format(text)

    let query
    if (text === '-') {
      query = `SELECT DISTINCT city FROM uberfares ORDER BY city;`
    } else {
      query = `SELECT DISTINCT city FROM uberfares WHERE city LIKE '${text}%' ORDER BY city;`
    }

    const data = await pool.query(query)
    res.json(data.rows)
  } catch (err) {
    console.error(err.message)
  }
})

app.get('/graph/:city', async (req, res) => {
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

app.get('/submit', async (req, res) => {
  try {
    let city = req.query.city
    city = city.toLowerCase()
    city = city.charAt(0).toUpperCase() + city.slice(1)

    let country = req.query.country
    country = country.toLowerCase()
    country = country.charAt(0).toUpperCase() + country.slice(1)

    let distance = req.query.distance

    let query = `SELECT * FROM taxifares WHERE country='${country}' AND city='${city}';`
    let data = await pool.query(query)
    data = data.rows[0]

    if (!data) {
      res.json('')
    }

    const price =
      parseFloat(data['taxistart']) + distance * parseFloat(data['taxiperkm'])

    data['price'] = price
    res.json(data)
  } catch (err) {
    console.error(err.message)
  }
})

app.listen(5000, () => {
  console.log('Server has started on port 5000')
})
