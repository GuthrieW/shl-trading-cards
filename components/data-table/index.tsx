import React from 'react'
import MUIDataTable from 'mui-datatables'

const DataTable = ({ title, data, columns, options }) => {
  return (
    <MUIDataTable
      title={title}
      data={data}
      columns={columns}
      options={options}
    />
  )
}

export default DataTable
