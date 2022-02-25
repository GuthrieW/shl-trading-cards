import React from 'react'
import MUIDataTable from 'mui-datatables'

type DataTableProps = {
  title: string
  data: any[]
  columns: any[]
  options: any
}

const DataTable = ({ title, columns, data, options }) => {
  return typeof window !== 'undefined' ? (
    <div style={{ width: '100%', height: '100%' }}>
      <MUIDataTable
        title={title}
        columns={columns}
        data={data}
        options={options}
      />
    </div>
  ) : null
}

export default DataTable
