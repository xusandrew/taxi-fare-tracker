import React, { useState, useEffect } from 'react'
import TaxiGraph from './TaxiGraph'

const TaxiTable = props => {
  const [taxiStart, setTaxiStart] = useState(0)
  const [taxiPerKm, setTaxiPerKm] = useState(0)

  const [showTable, setShowTable] = useState(false)
  const [tableNum, setTableNum] = useState(0)

  const get_data = async city => {
    let data = await fetch(
      `https://jydqtzjtpn.us-east-1.awsapprunner.com/taxi/${city}`
    )
    data = await data.json()

    setTaxiStart(parseFloat(data[data.length - 1]['taxistart']))
    setTaxiPerKm(parseFloat(data[data.length - 1]['taxiperkm']))
  }

  const entries = [1, 2, 5, 8, 10, 15, 20, 25]

  const get_price = num => taxiStart + num * taxiPerKm

  const format_title = num => {
    return `Average taxi fare for a ${num}km ride:`
  }

  const show_graph = num => {
    setShowTable(true)
    setTableNum(num)
  }

  const close_graph = () => {
    setShowTable(false)
    setTableNum(0)
  }

  useEffect(() => {
    get_data(props.city)
  }, [props.city])

  if (showTable) {
    return (
      <>
        <h3>{format_title(tableNum)}</h3>
        <TaxiGraph city={props.city} table_name={tableNum} />
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
        <h3>Average taxi fares per km:</h3>
        <div className='table-wrapper'>
          <table>
            <thead>
              <tr>
                <th>Distance</th>
                <th>Price</th>
                <th>Graph</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(num => {
                return (
                  <tr key={num}>
                    <th>{num} km</th>
                    <th>${get_price(num)}</th>
                    <th>
                      <button
                        onClick={() => {
                          show_graph(num)
                        }}
                        className='button small'
                        style={{ marginTop: '10.8px' }}
                      >
                        Graph
                      </button>
                    </th>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </>
    )
  }
}

export default TaxiTable
