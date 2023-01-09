const express = require('express')
const app = express()
const cors = require('cors')
const pool = require('./db')

app.use(cors())
app.use(express.json())

app.get('/countries/:country', async (req, res) => {
  try {
    let { country } = req.params

    country = country.toLowerCase()
    country = country.charAt(0).toUpperCase() + country.slice(1)

    let query
    if (country === 'Empty') {
      query = `SELECT DISTINCT country FROM taxifares ORDER BY country;`
    } else {
      query = `SELECT DISTINCT country FROM taxifares WHERE country LIKE '${country}%' ORDER BY country;`
    }

    const data = await pool.query(query)
    res.json(data.rows)
  } catch (err) {
    console.error(err.message)
  }
})

app.get('/city', async (req, res) => {
  try {
    let city = req.query.city
    city = city.toLowerCase()
    city = city.charAt(0).toUpperCase() + city.slice(1)

    let country = null
    if (req.query.country) {
      country = req.query.country
      country = country.toLowerCase()
      country = country.charAt(0).toUpperCase() + country.slice(1)
    }

    let query
    if (city === 'Empty') {
      if (country) {
        query = `SELECT country, city FROM taxifares WHERE country = '${country}'ORDER BY city;`
      } else {
        query = `SELECT country, city FROM taxifares ORDER BY city;`
      }
    } else {
      if (country) {
        query = `SELECT country, city FROM taxifares WHERE country = '${country}' AND city LIKE '${city}%' ORDER BY city;`
      } else {
        query = `SELECT country, city FROM taxifares WHERE city LIKE '${city}%' ORDER BY city;`
      }
    }

    const data = await pool.query(query)
    res.json(data.rows)
  } catch (err) {
    console.error(err.message)
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

    const price =
      parseFloat(data['taxistart']) + distance * parseFloat(data['taxiperkm'])

    res.json(price)
  } catch (err) {
    console.error(err.message)
  }
})

app.listen(5000, () => {
  console.log('Server has started on port 5000')
})
