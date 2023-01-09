import React, { useState } from 'react'

const Input = () => {
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [distance, setDistance] = useState('')

  const [countryChoices, setCountryChoices] = useState([])

  const searchCounties = async val => {
    try {
      if (!val) val = 'empty'

      let response = await fetch(`http://localhost:5000/countries/${val}`)
      response = await response.json()
      response = response.map(res => res['country'])
      setCountryChoices(response)
    } catch (err) {
      console.error(err.message)
    }
  }

  return (
    <>
      <datalist id='countries'>
        {countryChoices.map(country => (
          <option key={country}>{country}</option>
        ))}
      </datalist>

      <h1>Taxi Fares</h1>
      <form>
        <label>Country:</label>
        <input
          type='text'
          list='countries'
          value={country}
          onChange={e => {
            setCountry(e.target.value)
            searchCounties(e.target.value)
          }}
        />

        <label>City:</label>
        <input
          type='text'
          list='cities'
          value={city}
          onChange={e => setCity(e.target.value)}
        />

        <label>Distance(km)</label>
        <input
          type='number'
          value={distance}
          onChange={e => setDistance(e.target.value)}
        />

        <button type='submit'>Submit</button>
      </form>
    </>
  )
}

export default Input