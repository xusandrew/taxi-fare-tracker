import React, { useState } from 'react'

// Components
import Input from './components/Input'
import Info from './components/Info'

function App() {
  const [city, setCity] = useState('Toronto')
  const [displayData, setDisplayData] = useState(false)

  const onChangeCity = val => {
    setCity(val)
  }

  const onSubmitCity = async e => {
    e.preventDefault()
    try {
      let cities = await fetch(`http://localhost:5000/citylist/-`)
      cities = await cities.json()
      cities = cities.map(row => row.city)

      if (!cities.includes(city)) {
        alert('Pick a country from the given list.')
        return
      }

      setDisplayData(true)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <Input value={city} onChange={onChangeCity} onSubmit={onSubmitCity} />
      <Info city={city} displayData={displayData} />
    </>
  )
}

export default App
