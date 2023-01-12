import React, { useState } from 'react'

// Components
import Input from './components/Input'
import Info from './components/Info'

function App() {
  const [city, setCity] = useState('')

  const onChangeCity = val => {
    setCity(val)
  }

  const onSubmitCity = async e => {
    e.preventDefault()
    try {
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div id='container'>
      <Input value={city} onChange={onChangeCity} onSubmit={onSubmitCity} />
      <Info />
    </div>
  )
}

export default App
