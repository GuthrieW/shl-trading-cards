import React, { useMemo } from 'react'
import { Box, Link, SkeletonText } from '@chakra-ui/react'
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { TRADES_TABLE } from './tableBehaviorFlags'
import { TableHeader } from './TableHeader'
import { simpleGlobalFilterFn } from './shared'
import { Table } from './Table'
import { TextWithTooltip } from '@components/common/TruncateText'
import { formatDateTime } from '@utils/formatDateTime'

const columnHelper = createColumnHelper<Trade>()

type TradeProps = {
  trades: Trade[]
  isLoading: boolean
}

const ViewTradeTable = ({ trades, isLoading }: TradeProps) => {
  const columns = useMemo(() => {
    const currentColumns = [
      columnHelper.accessor(
        ({ trade_status, tradeID }) => [trade_status, tradeID],
        {
          header: 'Trade Status',
          cell: (props) => {
            const cellValue = props.getValue()
            return (
              <Link
                className="!hover:no-underline !text-link"
                href={`/trade/${cellValue[1]}`}
              >
                <TextWithTooltip
                  text={String(cellValue[0])}
                  maxLength={25}
                  tooltip={true}
                />
              </Link>
            )
          },
          enableSorting: true,
          enableGlobalFilter: true,
        }
      ),
      columnHelper.accessor('trade_status', {
        header: () => (
          <TableHeader title="trade_status">Trade Status</TableHeader>
        ),
        enableGlobalFilter: true,
      }),
      columnHelper.accessor('initiatorUsername', {
        header: () => (
          <TableHeader title="initiatorUsername">Sender</TableHeader>
        ),
        enableGlobalFilter: true,
      }),
      columnHelper.accessor('recipientUsername', {
        header: () => (
          <TableHeader title="recipientUsername">Receiver</TableHeader>
        ),
        enableGlobalFilter: false,
      }),
      columnHelper.accessor('create_date', {
        header: () => <TableHeader title="create_date">Date</TableHeader>,
        cell: (props) => {
          const cellValue = props.getValue()
          return formatDateTime(cellValue)
        },
        enableGlobalFilter: false,
      }),
    ]
    return currentColumns
  }, [])

  const table = useReactTable({
    columns,
    data: trades,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableGlobalFilter: true,
    globalFilterFn: simpleGlobalFilterFn,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      sorting: [{ id: 'create_date', desc: true }],
    },
    state: {
      columnVisibility: {
        trade_status: false,
      },
    },
  })

  return (
    <div className="w-full p-4 min-h-[400px]">
      {isLoading ? (
        <>
          <div className="flex justify-end"></div>
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden bg-primary">
              {Array.from({ length: 10 }).map((_, index) => (
                <Box key={index} p="4" borderTop="1px" borderColor="gray.200">
                  <SkeletonText noOfLines={1} spacing="4" />
                </Box>
              ))}
            </div>
            <div className="flex justify-center pt-4"></div>
          </div>
        </>
      ) : (
        <>
          <Table<Trade> table={table} tableBehavioralFlags={TRADES_TABLE} />
        </>
      )}
    </div>
  )
}

export default ViewTradeTable
