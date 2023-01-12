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

const Graph = ({ city, table_name }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Uber',
        data: [],
        fill: false,
        borderColor: 'rgb(0, 0, 0)',
        tension: 0.1,
        spanGaps: true,
      },
      {
        label: 'Lyft',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        spanGaps: true,
      },
    ],
  })

  const parseData = (data, table_name) => {
    let all_routes = data['uber'].concat(data['lyft'])
    all_routes.sort((e1, e2) => {
      let e1_time = e1.time.slice(0, -1)
      let e2_time = e2.time.slice(0, -1)
      return new Date(e1_time) - new Date(e2_time)
    })

    const labels = all_routes.map(e => {
      return new Date(e.time).toLocaleString()
    })

    const uber_data = all_routes.map(e => {
      if (!e.airport) {
        // Has no airport property, so lyft
        return null
      }
      return e[table_name]
    })

    const lyft_data = all_routes.map(e => {
      if (!e.airportlat) {
        // Has no airportlat property, so uber
        return null
      }
      return e[table_name]
    })

    return {
      labels: labels,
      datasets: [
        {
          label: 'Uber',
          data: uber_data,
          fill: false,
          borderColor: 'rgb(0, 0, 0)',
          tension: 0.1,
          spanGaps: true,
        },
        {
          label: 'Lyft',
          data: lyft_data,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          spanGaps: true,
        },
      ],
    }
  }

  const getData = async (city, table_name) => {
    const fetch_url = `http://localhost:5000/graph/${city}`
    const response = await fetch(fetch_url)
    let data = await response.json()

    let formatted_data = parseData(data, table_name)
    setChartData(formatted_data)
  }

  useEffect(() => {
    getData(city, table_name)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const options = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        color: 'white',
        text:
          table_name === 'centertoairport'
            ? 'Center to Airport'
            : 'Airport to Center',
      },
    },
  }

  return (
    <>
      <Line data={chartData} options={options}></Line>
    </>
  )
}

export default Graph
