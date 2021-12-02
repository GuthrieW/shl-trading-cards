import React from 'react'
import MUIDataTable from 'mui-datatables'

const DataTable = ({ title, data, columns, options }) => {
  return typeof window !== 'undefined' ? (
    <MUIDataTable
      title={title}
      data={data}
      columns={columns}
      options={options}
    />
  ) : null
}

export default DataTable
