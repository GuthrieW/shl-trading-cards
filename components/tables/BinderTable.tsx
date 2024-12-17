import React, { useState, useMemo, useEffect } from 'react'
import axios from 'axios'
import {
  Skeleton,
  SkeletonText,
  Box,
  Link,
  Heading,
  useBreakpointValue,
} from '@chakra-ui/react'
import { GET } from '@constants/http-methods'
import { binders } from '@pages/api/v3'
import { query } from '@pages/api/database/query'
import { useCookie } from '@hooks/useCookie'
import config from 'lib/config'
import { useSession } from 'contexts/AuthContext'
import UsersBinder from '@components/binder/UsersBinder'
import UsersBindersCarousel from '@components/carousel/UsersBindersCarousel'
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { BINDER_TABLE } from './tableBehaviorFlags'
import { TableHeader } from './TableHeader'
import { simpleGlobalFilterFn } from './shared'
import { Table } from './Table'
import { TextWithTooltip } from '@components/common/TruncateText'
import { useRouterPageState } from '@hooks/useRouterPageState'

const columnHelper = createColumnHelper<binders>()

const BinderTables = () => {
  const { page, setRouterPageState } = useRouterPageState<{
    page: number
  }>({
    keys: ['page'],
    initialState: {
      page: 1,
    },
  })
  const { loggedIn } = useSession()
  const [uid] = useCookie(config.userIDCookieName)

  const { payload: binders, isLoading } = query<binders[]>({
    queryKey: ['users-binders'],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/binder`,
      }),
  })
  const isMobile = useBreakpointValue({ base: true, md: false })

  const { payload: Userbinders, isLoading: UserBinderisLoading } = query<
    binders[]
  >({
    queryKey: ['users-binders', uid],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/binder`,
        params: {
          userID: uid,
        },
      }),
  })

  const totalPages = useMemo(
    () => (binders ? Math.ceil(binders.length / 10) : 1),
    [binders]
  )
  const [pagination, setPagination] = useState(() => ({
    pageIndex: page - 1,
    pageSize: 10,
  }))

  useEffect(() => {
    if (isLoading || !binders) return

    let validPageIndex = page
    if (page > totalPages || page < 1) {
      validPageIndex = 1
      setRouterPageState('page', 1)
    }

    setPagination({
      pageIndex: validPageIndex - 1,
      pageSize: 10,
    })
  }, [binders, isLoading, page, totalPages, setRouterPageState])

  const userBinders =
    binders?.filter((binder) => binder.userID === Number(uid)) || []
  const reachedLimit = useMemo(
    () => userBinders.length >= 5,
    [userBinders.length]
  )

  const columns = useMemo(() => {
    const currentColumns = [
      columnHelper.accessor(
        ({ binder_name, binderID }) => [binder_name, binderID],
        {
          header: 'Binder',
          cell: (props) => {
            const cellValue = props.getValue()
            return (
              <Link
                className="!hover:no-underline !text-link"
                href={`/binder/${cellValue[1]}`}
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
        }
      ),
      columnHelper.accessor('username', {
        header: () => <TableHeader title="Username">Username</TableHeader>,
        enableGlobalFilter: true,
      }),
      columnHelper.accessor('binder_desc', {
        header: () => (
          <TableHeader title="Description">Description</TableHeader>
        ),
        cell: (props) => (
          <TextWithTooltip
            text={props.getValue() || ''}
            maxLength={40}
            tooltip={false}
          />
        ),
        enableGlobalFilter: false,
      }),
    ]
    return currentColumns
  }, [])

  const table = useReactTable({
    columns,
    data: binders,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableGlobalFilter: true,
    globalFilterFn: simpleGlobalFilterFn,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (PaginationState) => {
      const newPagination =
        typeof PaginationState === 'function'
          ? PaginationState(pagination)
          : PaginationState
      setPagination(newPagination)
      setRouterPageState('page', newPagination.pageIndex + 1)
    },
    initialState: {
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: 10,
      },
    },
    state: {
      pagination,
      columnVisibility: {
        name: false,
      },
    },
  })
  return (
    <div className="w-full p-4 min-h-[400px]">
      {isLoading ? (
        <>
          <div className="flex justify-end"></div>
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden bg-table-header">
              <div className="grid grid-cols-4 gap-4 p-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton key={index} height="24px" />
                ))}
              </div>
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
          {loggedIn && (
            <Box className="rounded-lg pb-4">
              <Heading className="text-secondary text-center pb-1">
                Your Binders
              </Heading>
              {isMobile ? (
                <UsersBindersCarousel
                  binderData={Userbinders}
                  reachedLimit={reachedLimit}
                />
              ) : (
                <UsersBinder
                  binderData={Userbinders}
                  reachedLimit={reachedLimit}
                />
              )}
            </Box>
          )}

          <div className="border-b-8 border-b-blue700 bg-secondary p-2">
            <div className="flex flex-col gap-2">
              <h1 className="text-lg font-bold text-secondaryText sm:text-xl">
                Players Binders
              </h1>
            </div>
          </div>
          <Table<binders> table={table} tableBehavioralFlags={BINDER_TABLE} />
        </>
      )}
    </div>
  )
}

export default BinderTables
