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

  const parse_data = responseData => {
    responseData['uber'].forEach(e => {
      e['method'] = 'uber'
    })
    responseData['lyft'].forEach(e => {
      e['method'] = 'lyft'
    })

    let all_routes = responseData['uber'].concat(responseData['lyft'])

    all_routes = all_routes.map(e => {
      e.time = e.date.slice(0, -11)
      e.time += ':00:00'
      e.time = new Date(e.time)
      return e
    })

    const seen = {
      uber: [],
      lyft: [],
    }

    all_routes = all_routes.filter(e => {
      const duplicate = seen[e.method].includes(e.time.getTime())
      if (!duplicate) {
        seen[e.method].push(e.time.getTime())
      }
      return !duplicate
    })

    all_routes.sort((e1, e2) => {
      return e1.time - e2.time
    })

    let seen_times = []
    seen['uber'].forEach(e => {
      if (seen['lyft'].includes(e)) {
        seen_times.push(e)
      }
    })

    all_routes = all_routes.filter(e => {
      if (!seen_times.includes(e.time.getTime())) {
        return false
      }
      return true
    })

    if (all_routes.length > 24) {
      all_routes = all_routes.slice(-24)
    }

    const labels = seen_times.map(e => {
      let date = new Date(e)
      return date.getHours().toString() + ':00'
    })

    let uber_data = all_routes.filter(e => e.method === 'uber')
    uber_data = uber_data.map(e => e[props.table_name])

    let lyft_data = all_routes.filter(e => e.method === 'lyft')
    lyft_data = lyft_data.map(e => e[props.table_name])

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
    const fetch_url = `https://jydqtzjtpn.us-east-1.awsapprunner.com/routes/${props.city}`
    let response = await fetch(fetch_url)
    response = await response.json()
    parse_data(response, props.table_name)
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
