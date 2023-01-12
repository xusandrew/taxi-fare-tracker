import React from 'react'

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

const Graph = props => {
  const options = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        color: 'white',
        text: props.table_name,
      },
    },
  }

  return (
    <>
      <Line data={props.data} options={options}></Line>
    </>
  )
}

export default Graph
