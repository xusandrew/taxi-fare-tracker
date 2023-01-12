import React, { useState } from 'react'

const TaxiTable = props => {
  const [taxiStart, setTaxiStart] = useState(0)
  const [taxiPerKm, setTaxiPerKm] = useState(0)

  const entries = [
    [1, 10],
    [2, 15],
    [5, 20],
    [8, 25],
  ]

  const get_price = num => taxiStart + num * taxiPerKm

  return (
    <>
      <div className='table-wrapper'>
        <table>
          <thead>
            <tr>
              <th>Distance</th>
              <th>Price</th>
              <th>| |</th>
              <th>Distance</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => {
              return (
                <tr>
                  <th>{entry[0]} km</th>
                  <th>${get_price(entry[0])}</th>
                  <th>| |</th>
                  <th>{entry[1]} km</th>
                  <th>${get_price(entry[0])}</th>
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
