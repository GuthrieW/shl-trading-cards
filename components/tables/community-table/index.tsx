import SearchBar from '@components/inputs/search-bar'
import Router, { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from 'react-table'
import Pagination from '../pagination'
import Table from '../table'

type CommunityTableProps = {
  tableData: User[]
}

const CommunityTable = ({ tableData }: CommunityTableProps) => {
  const router = useRouter()

  const columnData: ColumnData[] = [
    {
      id: 'uid',
      Header: 'User ID',
      accessor: 'uid',
      title: 'User ID',
      sortDescFirst: false,
    },
    {
      id: 'username',
      Header: 'Username',
      accessor: 'username',
      title: 'Username',
      sortDescFirst: false,
    },
  ]

  const columns = useMemo(() => columnData, [])
  const data = useMemo(() => tableData, [])

  const initialState = useMemo(() => {
    return { sortBy: [{ id: 'username' }] }
  }, [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    pageOptions,
    pageCount,
    canPreviousPage,
    previousPage,
    canNextPage,
    nextPage,
    gotoPage,
    setGlobalFilter,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10, ...initialState },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  const gotoLastPage = () => gotoPage(pageCount - 1)
  const updateSearchFilter = (event) => setGlobalFilter(event.target.value)

  const handleRowClick = (row) => {
    const user: User = row.values
    router.push({
      pathname: '/collection/',
      query: { uid: user.uid },
    })
  }

  return (
    <div>
      <div className="flex justify-end items-center">
        <SearchBar onChange={updateSearchFilter} />
      </div>
      <Table
        getTableProps={getTableProps}
        headerGroups={headerGroups}
        getTableBodyProps={getTableBodyProps}
        rows={page}
        prepareRow={prepareRow}
        onRowClick={handleRowClick}
      />
      <Pagination
        pageOptions={pageOptions}
        pageIndex={pageIndex}
        canNextPage={canNextPage}
        nextPage={nextPage}
        canPreviousPage={canPreviousPage}
        previousPage={previousPage}
        gotoPage={gotoPage}
        gotoLastPage={gotoLastPage}
      />
    </div>
  )
}

export default CommunityTable