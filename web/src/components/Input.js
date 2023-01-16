import React, { useState, useEffect } from 'react'

const Input = props => {
  const [cityChoices, setCityChoices] = useState([])

  const searchCitys = async () => {
    try {
      let fetch_url = 'http://localhost:5000/citylist'

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

      <form onSubmit={props.onSubmit}>
        <h2>Select your city:</h2>

        <div className='col-6 col-12-xsmall'>
          <input
            type='text'
            list='cities'
            value={props.value}
            onChange={e => {
              props.onChange(e.target.value)
            }}
            className='col-6'
            placeholder='City'
          />
        </div>

        <button
          type='submit'
          className='button'
          style={{ marginTop: '1.5rem' }}
        >
          Search
        </button>
      </form>
    </>
  )
}

export default Input
