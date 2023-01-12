import React, { useState, useEffect } from 'react'

const RouteTable = props => {
  const [uberPrice, setUberPrice] = useState({
    centertoairport: 0,
    airporttocenter: 0,
  })

  const [lyftPrice, setLyftPrice] = useState({
    centertoairport: 0,
    airporttocenter: 0,
  })

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

  useEffect(() => {
    get_data(props.city)
  }, [props.city])

  return (
    <>
      <h3>Routes in {props.city}:</h3>
      <div className='table-wrapper'>
        <table>
          <thead>
            <tr>
              <th style={{ color: 'white' }}>You found me!</th>
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
              <th>${get_price('lyft', 'centertoairport')}</th>
              <th>
                <button className='button small'>Graph</button>
              </th>
            </tr>

            <tr>
              <th colSpan='5'>City Center to Airport</th>
            </tr>
            <tr>
              <th>Uber</th>
              <th>${get_price('uber', 'airporttocenter')}</th>
              <th>Lyft</th>
              <th>${get_price('lyft', 'centertoairport')}</th>
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
