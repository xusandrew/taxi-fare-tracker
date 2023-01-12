import React, { useState } from 'react'

const TaxiTable = props => {
  const [taxiStart, setTaxiStart] = useState(0)
  const [taxiPerKm, setTaxiPerKm] = useState(0)

  const entries = [1, 2, 5, 8, 10, 15, 20, 25]

  const get_price = num => taxiStart + num * taxiPerKm

  const showGraph = () => {}

  return (
    <>
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
                <tr>
                  <th>{num} km</th>
                  <th>${get_price(num)}</th>
                  <th>
                    <button onClick={showGraph} className='button small'>
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

export default TaxiTable
