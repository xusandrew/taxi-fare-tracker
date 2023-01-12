import React from 'react'

import RouteTable from './RouteTable'
import TaxiTable from './TaxiTable'

const Info = props => {
  return (
    <section style={{ height: '1000px' }}>
      <div className='row'>
        <div className='col-6 col-12-medium'>
          <RouteTable city={props.city} />
        </div>
        <div className='col-6 col-12-medium'>
          <TaxiTable city={props.city} />
        </div>
      </div>
    </section>
  )
}

export default Info
