import React, { useState, useEffect } from 'react'
import Graph from './Graph'

const RouteGraph = props => {
  const [data, setData] = useState({
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

  const parseData = responseData => {
    let all_routes = responseData['uber'].concat(responseData['lyft'])
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
      return e[props.table_name]
    })

    const lyft_data = all_routes.map(e => {
      if (!e.airportlat) {
        // Has no airportlat property, so uber
        return null
      }
      return e[props.table_name]
    })

    setData({
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
          borderColor: 'rgb(255,0,191)',
          tension: 0.1,
          spanGaps: true,
        },
      ],
    })
  }

  const getData = async () => {
    const fetch_url = `http://localhost:5000/routes/${props.city}`
    let response = await fetch(fetch_url)
    response = await response.json()
    parseData(response, props.table_name)
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

export default RouteGraph
