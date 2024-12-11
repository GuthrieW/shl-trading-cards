import React, { useMemo, useState, useEffect } from 'react'
import axios from 'axios'
import { SkeletonText, Box, Link } from '@chakra-ui/react'
import { GET } from '@constants/http-methods'
import { UserMostCards } from '@pages/api/v3'
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { BINDER_TABLE, CARDS_TABLE } from './tableBehaviorFlags'
import { TableHeader } from './TableHeader'
import { simpleGlobalFilterFn } from './shared'
import { Table } from './Table'
import { query } from '@pages/api/database/query'

const columnHelper = createColumnHelper<UserMostCards>()

const MostCards = () => {
  const { payload, isLoading } = query<UserMostCards[]>({
    queryKey: ['most-cards'],
    queryFn: () =>
      axios({
        method: GET,
        data: { limit: 10 },
        url: `/api/v3/user/most-cards`,
      }),
  })

  const columns = useMemo(() => {
    const currentColumns = [
      columnHelper.accessor(({ userID, username }) => [userID, username], {
        header: 'Username',
        cell: (props) => {
          const cellValue = props.getValue()
          return (
            <Link
              className="!hover:no-underline !text-link"
              href={`/collect/${cellValue[0]}`}
            >
              {cellValue[1]}
            </Link>
          )
        },
        enableSorting: true,
        enableGlobalFilter: true,
      }),
      columnHelper.accessor('username', {
        header: () => <TableHeader title="username">username</TableHeader>,
        enableGlobalFilter: true,
      }),
      columnHelper.accessor('uniqueCards', {
        header: () => (
          <TableHeader title="uniqueCards">Unique Cards</TableHeader>
        ),
        enableGlobalFilter: true,
      }),
      columnHelper.accessor('totalCards', {
        header: () => <TableHeader title="totalCards">Total Cards</TableHeader>,
        enableGlobalFilter: false,
        enableSorting: true,
      }),
    ]
    return currentColumns
  }, [])

  const table = useReactTable({
    columns,
    data: payload,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableGlobalFilter: true,
    globalFilterFn: simpleGlobalFilterFn,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      sorting: [{ id: 'owned_count', desc: true }],
    },
    state: {
      columnVisibility: {
        username: false,
      },
    },
  })

  return (
    <div className="w-full p-4 min-h-[400px]">
      <div className="border-b-8 border-b-blue700 bg-secondary p-2 flex items-center justify-between">
        <h1 className="text-lg font-bold text-secondaryText sm:text-xl">
          Most Cards Collected
        </h1>
      </div>
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
          <Table<UserMostCards>
            table={table}
            tableBehavioralFlags={CARDS_TABLE}
          />
        </>
      )}
    </div>
  )
}

export default MostCards
