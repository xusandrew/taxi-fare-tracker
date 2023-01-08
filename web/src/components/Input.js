import React from 'react'

const Input = () => {
  return (
    <>
      <datalist id='countries'>
        <option>Volvo</option>
      </datalist>

      <h1>Taxi Fares</h1>
      <form>
        <label for='country'>Country:</label>
        <input type='text' list='countries' id='country' name='country' />

        <label for='city'>City:</label>
        <input type='text' list='cities' id='city' name='city' />

        <label for='distance'>Distance(km)</label>
        <input type='number' id='distance' name='distance' />

        <button type='submit'>Submit</button>
      </form>
    </>
  )
}

export default Input
