import React, { useState, useEffect } from 'react'
import RouteGraph from './RouteGraph'

const RouteTable = props => {
  const [uberPrice, setUberPrice] = useState({
    centertoairport: 0,
    airporttocenter: 0,
  })

  const [lyftPrice, setLyftPrice] = useState({
    centertoairport: 0,
    airporttocenter: 0,
  })

  const [showTable, setShowTable] = useState(false)
  const [tableName, setTableName] = useState('')

  const get_data = async city => {
    let data = await fetch(`http://localhost:5000/routes/${city}`)
    data = await data.json()

    let uber_data = data.uber[data.uber.length - 1]
    let lyft_data = data.lyft[data.lyft.length - 1]

    setUberPrice({
      centertoairport: uber_data['centertoairport'],
      airporttocenter: uber_data['airporttocenter'],
    })
    setLyftPrice({
      centertoairport: lyft_data['centertoairport'],
      airporttocenter: lyft_data['airporttocenter'],
    })
  }

  const get_price = (name, route) => {
    let price
    if (name === 'uber') {
      price = uberPrice
    } else {
      price = lyftPrice
    }

    return price[route]
  }

  const format_title = name => {
    return name === 'airporttocenter'
      ? 'Airport to City Center'
      : 'City Center to Airport'
  }

  const show_graph = name => {
    setTableName(name)
    setShowTable(true)
  }

  const close_graph = () => {
    setShowTable(false)
    setTableName('')
  }

  useEffect(() => {
    get_data(props.city)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (showTable) {
    return (
      <>
        <h3>
          Routes in {props.city}: {format_title(tableName)}
        </h3>
        <RouteGraph city={props.city} table_name={tableName} />
        <button
          className='button'
          onClick={() => {
            close_graph()
          }}
          style={{ marginTop: '10px', marginBottom: '30px' }}
        >
          Close
        </button>
      </>
    )
  } else {
    return (
      <>
        <h3>Routes in {props.city}:</h3>
        <div className='table-wrapper'>
          <table>
            <thead>
              <tr>
                <th colSpan='5' style={{ color: 'white' }}>
                  You found me!
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th colSpan='5'>Airport to City Center</th>
              </tr>
              <tr>
                <th>Uber</th>
                <th>${get_price('uber', 'airporttocenter')}</th>
                <th>Lyft</th>
                <th>${get_price('lyft', 'airporttocenter')}</th>
                <th>
                  <button
                    className='button small'
                    onClick={() => {
                      show_graph('airporttocenter')
                    }}
                    style={{ marginTop: '10.8px' }}
                  >
                    Graph
                  </button>
                </th>
              </tr>

              <tr>
                <th colSpan='5'>City Center to Airport</th>
              </tr>
              <tr>
                <th>Uber</th>
                <th>${get_price('uber', 'centertoairport')}</th>
                <th>Lyft</th>
                <th>${get_price('lyft', 'centertoairport')}</th>
                <th>
                  <button
                    className='button small'
                    onClick={() => {
                      show_graph('centertoairport')
                    }}
                    style={{ marginTop: '10.8px' }}
                  >
                    Graph
                  </button>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    )
  }
}

export default RouteTable
