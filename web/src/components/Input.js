import React, { useState, useEffect } from 'react'

const Input = props => {
  const [cityChoices, setCityChoices] = useState([])

  const searchCitys = async city_val => {
    try {
      if (!city_val) city_val = 'empty'

      let fetch_url = `http://localhost:5000/citylist?city=${city_val}`

      let response = await fetch(fetch_url)
      response = await response.json()
      response = response.map(res => res['city'])
      setCityChoices(response)
    } catch (err) {
      console.error(err.message)
    }
  }

  useEffect(() => {
    searchCitys()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <datalist id='cities'>
        {cityChoices.map((city, i) => (
          <option key={i}>{city}</option>
        ))}
      </datalist>

      <form onSubmit={props.onSubmitCity}>
        <h3>Select your city:</h3>
        <input
          type='text'
          list='cities'
          value={props.city}
          onChange={e => {
            props.onChange()
            searchCitys(e.target.value)
          }}
        />

        <button type='submit'>Search</button>
      </form>
    </>
  )
}

export default Input
