import React from 'react'
import MaterialTable, { Icons, Action, Column } from 'material-table'

export type TableProps = {
  columns: Column<any>[]
  data: any[]
  title: string
  actions: Action<any>[]
}

const CardTable = ({ columns, data, title, actions = null }: TableProps) => {
  return (
    <MaterialTable
      columns={columns}
      data={data}
      title={title}
      components={{}}
      options={{}}
      actions={actions}
    />
  )
}

export default CardTable
