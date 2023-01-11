import React, { useState, useEffect } from 'react'

const Input = () => {
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')

  const [countryChoices, setCountryChoices] = useState([])
  const [cityChoices, setCityChoices] = useState([])

  const searchCountries = async country_val => {
    try {
      if (!country_val) country_val = 'empty'

      let response = await fetch(
        `http://localhost:5000/countries/${country_val}`
      )
      response = await response.json()
      response = response.map(res => res['country'])
      setCountryChoices(response)
    } catch (err) {
      console.error(err.message)
    }
  }

  const searchCitys = async (city_val, country_val) => {
    try {
      if (!city_val) city_val = 'empty'

      let fetch_url = `http://localhost:5000/city?city=${city_val}`

      if (countryChoices.includes(country_val)) {
        fetch_url += `&country=${country_val}`
      }

      let response = await fetch(fetch_url)
      response = await response.json()
      response = response.map(res => res['city'])
      setCityChoices(response)
    } catch (err) {
      console.error(err.message)
    }
  }

  const onSubmit = async e => {
    e.preventDefault()
    try {
      //
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    searchCountries()
    searchCitys()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <datalist id='countries'>
        {countryChoices.map((country, i) => (
          <option key={country}>{country}</option>
        ))}
      </datalist>

      <datalist id='cities'>
        {cityChoices.map((city, i) => (
          <option key={i}>{city}</option>
        ))}
      </datalist>

      <form onSubmit={onSubmit}>
        <h3>Select your city:</h3>
        <div className='form-input-section'>
          <label>Country</label>
          <label>City</label>
          <input
            type='text'
            list='countries'
            value={country}
            onChange={e => {
              setCountry(e.target.value)
              searchCountries(e.target.value)
              searchCitys(null, e.target.value)
            }}
          />
          <input
            type='text'
            list='cities'
            value={city}
            onChange={e => {
              setCity(e.target.value)
              searchCitys(e.target.value)
            }}
          />
        </div>

        <button type='submit'>Search</button>
      </form>
    </>
  )
}

export default Input
