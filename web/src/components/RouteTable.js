import React from 'react'

const RouteTable = props => {
  return (
    <>
      <h3>Routes in {props.city}:</h3>
      <div className='table-wrapper'>
        <table>
          <thead>
            <th></th>
          </thead>
          <tbody>
            <tr>
              <th colspan='5'>Airport to City Center</th>
            </tr>
            <tr>
              <th>Uber</th>
              <th>$</th>
              <th>Lyft</th>
              <th>$</th>
              <th>
                <button className='button small'>Graph</button>
              </th>
            </tr>

            <tr>
              <th colspan='5'>City Center to Airport</th>
            </tr>
            <tr>
              <th>Uber</th>
              <th>$</th>
              <th>Lyft</th>
              <th>$</th>
              <th>
                <button className='button small'>Graph</button>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default RouteTable
