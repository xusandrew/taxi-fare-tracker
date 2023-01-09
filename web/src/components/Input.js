import React, { useState } from 'react'

const Input = () => {
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [distance, setDistance] = useState('')

  return (
    <>
      <datalist id='countries'>{/* <option>Volvo</option> */}</datalist>

      <h1>Taxi Fares</h1>
      <form>
        <label>Country:</label>
        <input
          type='text'
          list='countries'
          value={country}
          onChange={e => setCountry(e.target.value)}
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
