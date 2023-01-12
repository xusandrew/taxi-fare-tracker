import React, { useState } from 'react'
import './App.css'

// Components
import Input from './components/Input'

import Title from './components/Title'
import Info from './components/Info'

function App() {
  const [currentCity, setCurrentCity] = useState('Vancouver')

  return (
    <div id='body'>
      <Title />
      <Input />
      <Info />
    </div>

    </>
  )
}

export default App
