import React, { useState } from 'react'
import './App.css'

// Components
import Input from './components/Input'
import Graph from './components/Graph'

function App() {
  const [currentCity, setCurrentCity] = useState('Vancouver')

  return (
    <>
      <Input />
      <div>
        <Graph city={currentCity} table_name='airporttocenter' />
      </div>
    </>
  )
}

export default App
