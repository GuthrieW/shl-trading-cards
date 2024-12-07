import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { flexRender, Table as ReactTableProps } from '@tanstack/react-table'
import classnames from 'classnames'

import { FilterControl } from './FilterControl'
import { PaginationControl } from './PaginationControl'
import { TableBehavioralFlags } from './tableBehaviorFlags'

export const Table = <T extends Record<string, unknown>>({
  table,
  tableBehavioralFlags,
  label,
}: {
  table: ReactTableProps<T>
  tableBehavioralFlags: TableBehavioralFlags
  label?: string
}) => {
  return (
    <div className="relative">
      <div
        className={classnames(
          'space-x-2',
          tableBehavioralFlags.enableFiltering ? 'mb-2 flex w-full' : 'hidden',
          !tableBehavioralFlags.enableFiltering && 'justify-end'
        )}
      >
        {tableBehavioralFlags.enableFiltering && (
          <FilterControl
            table={table}
            tableBehavioralFlags={tableBehavioralFlags}
          />
        )}
      </div>
      <div
        className={classnames(
          'overflow-x-auto overflow-y-hidden border border-t-0 border-table'
        )}
      >
        <table className="w-full border-separate border-spacing-0">
          <thead className="relative bg-primary text-secondary">
            {table.getHeaderGroups().map((headerGroup, i) => (
              <tr key={headerGroup.id} className="table-row">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      onKeyDown={(event) => {
                        const toggleHandler =
                          header.column.getToggleSortingHandler()
                        if (event.key == 'Enter' && toggleHandler) {
                          toggleHandler(event)
                        }
                      }}
                      colSpan={header.colSpan}
                      className={classnames(
                        tableBehavioralFlags.stickyFirstColumn &&
                          'first:sticky first:left-0 first:z-10',
                        'relative h-[50px] bg-primary font-normal first:pl-2.5 first:text-left',
                        table.getHeaderGroups().length > 1
                          ? i === 1 && '[&:not(:first-child)]:cursor-pointer'
                          : '[&:not(:first-child)]:cursor-pointer'
                      )}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() && (
                        <>
                          {header.column.getIsSorted() === 'desc' ? (
                            <ChevronDownIcon />
                          ) : (
                            <ChevronUpIcon />
                          )}
                        </>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className="relative table-row-group bg-primary align-middle">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-blue600/10">
                {tableBehavioralFlags.stickyFirstColumn && (
                  <th className="sticky left-0 table-cell border-t border-t-table bg-primary text-left font-mont font-normal">
                    {flexRender(
                      row.getVisibleCells()[0].column.columnDef.cell,
                      row.getVisibleCells()[0].getContext()
                    )}
                  </th>
                )}

                {row.getVisibleCells().map((cell, i) => {
                  if (tableBehavioralFlags.stickyFirstColumn && i === 0) return

                  return (
                    <td
                      key={cell.id}
                      className={classnames(
                        'whitespace-nowrap border-t border-t-table p-2 text-center font-mont text-xs md:text-lg',
                        cell.column.getIsSorted() && 'bg-blue700/10'
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
          {tableBehavioralFlags.showTableFooter && (
            <tfoot>
              {table.getFooterGroups().map(
                (footerGroup, i) =>
                  i === 0 && (
                    <tr key={footerGroup.id}>
                      {footerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className={classnames(
                            'border-t border-t-table py-3 font-mont font-normal',
                            header.column.getIsSorted() && 'bg-blue700/10 '
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.footer,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  )
              )}
            </tfoot>
          )}
        </table>
      </div>
      {/* TODO(UX improvements): Preserve pagination state in url */}
      {tableBehavioralFlags.enablePagination && (
        <PaginationControl table={table} />
      )}
    </div>
  )
}
