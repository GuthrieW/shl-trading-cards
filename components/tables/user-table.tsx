import React from 'react'
import MUIDataTable from 'mui-datatables'

const CardTable = ({ title, data, columns, options }) => {
  return (
    <MUIDataTable
      title={title}
      data={data}
      columns={columns}
      options={options}
    />
  )
}

export default CardTable
