import SearchBar from '@components/inputs/search-bar'
import Table from './table'
import Pagination from './pagination'
import { useMemo, useState } from 'react'
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from 'react-table'
import { warningToast } from '@utils/toasts'
import useEditDonator from '@pages/api/mutations/use-edit-donator'
import EditDonatorModal from '@components/modals/edit-donator-modal'

export type DonationManagementTableProps = {
  tableData: User[]
}

type ColumnData = {
  id: string
  Header: string
  accessor: string
  title: string
  sortDescFirst: boolean
}

const DonationManagementTable = ({
  tableData,
}: DonationManagementTableProps) => {
  const { editDonator, response, isSuccess, isLoading, isError } =
    useEditDonator()

  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedButtonId, setSelectedButtonId] =
    useState<PlayerTableButtonId>('skaters')
  const [modalRow, setModalRow] = useState<{
    uid: number
    username: string
    subsscription: number
  }>(null)

  const columnData: ColumnData[] = [
    {
      id: 'username',
      Header: 'Username',
      accessor: 'username',
      title: 'Username',
      sortDescFirst: false,
    },
    {
      id: 'uid',
      Header: 'uid',
      accessor: 'uid',
      title: 'uid',
      sortDescFirst: false,
    },
    {
      id: 'subscription',
      Header: 'Subscription',
      accessor: 'subscription',
      title: 'Subscription',
      sortDescFirst: false,
    },
  ]

  const columns = useMemo(() => columnData, [])
  const data = useMemo(() => tableData, [tableData])
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
    setModalRow(row.values)
    setShowModal(true)
  }

  const handleEditDonator = (newDonatorData) => {
    if (isLoading) {
      warningToast({ warningText: 'Already editing a donator' })
    }

    editDonator({
      uid: newDonatorData.uid,
      subscription: newDonatorData.subscription,
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center">
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
      {showModal && (
        <EditDonatorModal
          uid={modalRow.uid}
          username={modalRow.username}
          subscription={modalRow.subsscription}
          onSubmit={handleEditDonator}
          setShowModal={setShowModal}
        />
      )}
    </div>
  )
}

export default DonationManagementTable
