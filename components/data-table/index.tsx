import React from 'react'
import MUIDataTable from 'mui-datatables'
import { Skeleton } from '@material-ui/lab'

const defaultOptions = {
  filterType: 'dropdown',
  download: false,
  print: false,
  selectableRows: 'none',
  onRowClick: (rowData) => {
    return
  },

  responsive: 'standard',
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
