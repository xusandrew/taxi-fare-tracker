import React, { useState } from 'react'

// Components
import Input from './components/Input'
import Info from './components/Info'

function App() {
  const [cityText, setCityText] = useState('')
  const [city, setCity] = useState('')
  const [displayData, setDisplayData] = useState(false)

  const onChangeCity = val => {
    setCityText(val)
  }

  const onSubmitCity = async e => {
    e.preventDefault()
    try {
      let cities = await fetch(
        `https://jydqtzjtpn.us-east-1.awsapprunner.com/citylist`
      )
      cities = await cities.json()
      cities = cities.map(row => row.city)

      if (!cities.includes(cityText)) {
        alert('Pick a country from the given list.')
        return
      }

      setCity(cityText)
      setDisplayData(true)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <Input value={cityText} onChange={onChangeCity} onSubmit={onSubmitCity} />
      <Info city={city} displayData={displayData} />
    </>
  )
}

export default App
