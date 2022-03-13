import React from 'react'

type TableProps = {
  getTableProps: Function
  headerGroups: any[]
  getTableBodyProps: Function
  rows: any[]
  prepareRow: Function
  onRowClick?: Function
}

const Table = ({
  getTableProps,
  headerGroups,
  getTableBodyProps,
  rows,
  prepareRow,
  onRowClick,
}: TableProps) => (
  <div className="my-2 rounded-md border border-t-0 border-neutral-800 overflow-x-auto overflow-y-hidden">
    <table className="w-full" {...getTableProps()}>
      <thead className="bg-neutral-800 text-gray-100 relative">
        {headerGroups.map((headerGroup, headerGroupIndex) => (
          <tr
            key={headerGroupIndex}
            className="table-row"
            {...headerGroup.getHeaderGroupProps()}
          >
            {headerGroup.headers.map((header, headerIndex) => (
              <th
                key={headerIndex}
                className="h-12 px-1 font-normal bg-neutral-800 relative first:pl-4 last:pr-4"
                {...header.getHeaderProps(header.getSortByToggleProps())}
                title={header.title}
              >
                {header.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody
        className=" table-row-group bg-gray-100 mx-auto my-0 align-middle relative"
        {...getTableBodyProps()}
      >
        {rows.map((row, index) => {
          prepareRow(row)
          return (
            <tr
              key={index}
              className="hover:bg-gray-300"
              onClick={() => (onRowClick ? onRowClick() : null)}
              {...row.getRowProps()}
            >
              {row.cells.map((cell, index) => (
                <td
                  key={index}
                  className=" p-2 text-center"
                  {...cell.getCellProps()}
                >
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)

export default Table
