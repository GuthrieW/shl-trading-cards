import React from 'react'
import Table from 'rc-table'

export type Columns = {
  title: string
  dataIndex: string
  key: string
  width: number
}

export type DataTableProps = {
  columns: Columns
  data: any
}

const DataTable = ({ title, columns, data }) => {
  return typeof window !== 'undefined' ? (
    <div style={{ width: '100%', height: '100%' }}>
      <Table columns={columns} data={data} />
    </div>
  ) : null
}

export default DataTable
