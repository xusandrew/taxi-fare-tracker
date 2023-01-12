import React from 'react'

import Graph from './Graph'
import TaxiTable from './TaxiTable'

const Info = () => {
  return (
    <section style={{ height: '1000px' }}>
      <div className='row'>
        <div className='col-6 col-12-medium'>
          <Graph city='Toronto' table_name='centertoairport' />
        </div>
        <div className='col-6 col-12-medium'>
          <TaxiTable city='Toronto' />
        </div>
      </div>
    </section>
  )
}

export default Info
