import React, { useState } from 'react'
import './App.css'

// Components
import Input from './components/Input'
import Graph from './components/Graph'

function App() {
  const [chartData, setChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  })

  return (
    <>
      <Input />
      <div>
        <Graph chartData={chartData} />
      </div>
    </>
  )
}

export default App
