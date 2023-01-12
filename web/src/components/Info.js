import React from 'react'

import Graph from './Graph'

const Info = () => {
  return (
    <>
      <div className='bottom'>
        <div className='left'>
          <Graph city='Toronto' table_name='centertoairport' />
        </div>
        <div className='right'>{/* TABLE */}Lol</div>
      </div>
    </>
  )
}

export default Info
