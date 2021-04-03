import React from 'react'

const CardTable = ({ title, data, columns, options }) => {
  return (
    <MUIDataTable
      title={'Edit Cards'}
      data={data}
      columns={columns}
      options={options}
    />
  )
}

export default CardTable
