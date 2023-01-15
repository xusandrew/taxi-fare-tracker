import React, { useState, useEffect } from 'react'
import Graph from './Graph'

const TaxiGraph = props => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Taxi Fare',
        data: [],
        fill: false,
        borderColor: 'rgb(0, 0, 0)',
        tension: 0.1,
        spanGaps: true,
      },
    ],
  })

  const parse_data = response_data => {
    response_data = response_data.map(e => {
      e.time = e.date.slice(0, -14)
      e.time += 'T00:00:00'
      e.time = new Date(e.time)
      return e
    })

    let seen_times = []
    response_data = response_data.filter(e => {
      const duplicate = seen_times.includes(e.time.getTime())
      seen_times.push(e.time.getTime())
      return !duplicate
    })

    if (response_data.length > 10) {
      response_data = response_data.slice(-10)
    }

    const labels = response_data.map(e => {
      return e.time.toDateString().slice(4)
    })

    const graph_data = response_data.map(e => {
      let taxi_start = parseFloat(e.taxistart)
      let taxi_per_km = parseFloat(e.taxiperkm)

      return taxi_start + props.table_name * taxi_per_km
    })

    setData({
      labels: labels,
      datasets: [
        {
          label: 'Taxi Fare',
          data: graph_data,
          fill: false,
          borderColor: 'rgb(0, 0, 0)',
          tension: 0.1,
          spanGaps: true,
        },
      ],
    })
  }

  const getData = async () => {
    const fetch_url = `http://localhost:5000/taxi/${props.city}`
    let response = await fetch(fetch_url)
    response = await response.json()
    parse_data(response)
  }

  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Graph data={data} table_name={props.table_name} />
    </>
  )
}

export default TaxiGraph
