import React from 'react'
import MUIDataTable from 'mui-datatables'

const defaultOptions = {
  filterType: 'dropdown',
  download: false,
  print: false,
  selectableRows: 'none',
  onRowClick: (rowData) => {
    return
  },
  responsive: 'simple',
}

const DataTable = ({ title, data, columns, options }) => {
  return typeof window !== 'undefined' ? (
    <MUIDataTable
      title={title}
      data={data}
      columns={columns}
      options={{
        ...defaultOptions,
        ...options,
      }}
    />
  ) : null
}

export default DataTable
