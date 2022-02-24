import React, { useMemo } from 'react'
import { useTable, Column } from 'react-table'

type DataTableProps = {
  title: string
  tableData: any[]
  tableColumns: any[]
}

const DataTable = ({ title, tableColumns, tableData }: DataTableProps) => {
  const columns = useMemo<Column<any>[]>(
    () => [
      {
        Header: '',
        accessor: '',
      },
      {
        Header: 'Username',
        accessor: 'username',
      },
    ],
    []
  )
  const data = useMemo<any[]>(
    () => [
      {
        uid: '123',
        username: 'cal',
      },
    ],
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data })

  return typeof window !== 'undefined' ? (
    <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                style={{
                  borderBottom: 'solid 3px red',
                  background: 'aliceblue',
                  color: 'black',
                  fontWeight: 'bold',
                }}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td
                  {...cell.getCellProps()}
                  style={{
                    padding: '10px',
                    border: 'solid 1px gray',
                    background: 'papaywhip',
                  }}
                >
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  ) : null
}

export default DataTable
