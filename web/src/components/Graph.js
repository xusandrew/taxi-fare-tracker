import React, { useEffect, useState } from 'react'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const Graph = ({ city }) => {
  const chartData = {
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
  }

  //   const [chartData, setChartData] = useState()

  const parseData = data => {}

  const getData = async city_name => {
    const fetch_url = `http://localhost:5000/graph/${city_name}`
    const response = await fetch(fetch_url)
    let data = await response.json()
    console.log(data)

    let formatted_data = parseData(data)
    console.log(formatted_data)
  }

  useEffect(() => {
    getData(city)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const options = {}

  return (
    <>
      <Line data={chartData} options={options}></Line>
    </>
  )
}

export default Graph
