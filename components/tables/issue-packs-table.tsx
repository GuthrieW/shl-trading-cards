// import SearchBar from '@components/inputs/search-bar'
// import {
//   useTable,
//   useSortBy,
//   usePagination,
//   useGlobalFilter,
// } from 'react-table'
// import Pagination from './pagination'
// import Table from './table'
// import React, { useMemo, useState } from 'react'
// import useIssuePack from '@pages/api/mutations/use-issue-pack'
// import IssuePacksModal from '@components/modals/issue-packs-modal'
// import { warningToast } from '@utils/toasts'
// import getUidFromSession from '@utils/get-uid-from-session'
// import packsMap from '@constants/packs-map'

// type IssuePacksTableProps = {
//   tableData: User[]
// }

// const IssuePacksTable = ({ tableData }: IssuePacksTableProps) => {
//   const [showModal, setShowModal] = useState<boolean>(false)
//   const [modalRow, setModalRow] = useState<User>(null)

//   const { issuePack, response, isSuccess, isLoading, isError } = useIssuePack()

//   const columnData: ColumnData[] = [
//     {
//       id: 'uid',
//       Header: 'User ID',
//       accessor: 'uid',
//       title: 'User ID',
//       sortDescFirst: false,
//     },
//     {
//       id: 'username',
//       Header: 'Username',
//       accessor: 'username',
//       title: 'Username',
//       sortDescFirst: false,
//     },
//   ]
//   const columns = useMemo(() => columnData, [])
//   const data = useMemo(() => tableData, [])

//   const initialState = useMemo(() => {
//     return { sortBy: [{ id: 'username' }] }
//   }, [])

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     page,
//     prepareRow,
//     pageOptions,
//     pageCount,
//     canPreviousPage,
//     previousPage,
//     canNextPage,
//     nextPage,
//     gotoPage,
//     setGlobalFilter,
//     state: { pageIndex },
//   } = useTable(
//     {
//       columns,
//       data,
//       initialState: { pageIndex: 0, pageSize: 10, ...initialState },
//     },
//     useGlobalFilter,
//     useSortBy,
//     usePagination
//   )

//   const gotoLastPage = () => gotoPage(pageCount - 1)
//   const updateSearchFilter = (event) => setGlobalFilter(event.target.value)

//   const handleRowClick = (row) => {
//     const user: User = row.values
//     setModalRow(user)
//     setShowModal(true)
//   }

//   const handleIssuePack = () => {
//     if (isLoading) {
//       warningToast({ warningText: 'Already issuing a pack' })
//     }

//     issuePack({
//       packType: packsMap.base.id,
//       issuerID: getUidFromSession(),
//       receiverID: modalRow.uid,
//     })
//   }

//   return (
//     <div>
//       <div className="flex justify-end items-center">
//         <SearchBar onChange={updateSearchFilter} />
//       </div>
//       <Table
//         getTableProps={getTableProps}
//         headerGroups={headerGroups}
//         getTableBodyProps={getTableBodyProps}
//         rows={page}
//         prepareRow={prepareRow}
//         onRowClick={handleRowClick}
//       />
//       <Pagination
//         pageOptions={pageOptions}
//         pageIndex={pageIndex}
//         canNextPage={canNextPage}
//         nextPage={nextPage}
//         canPreviousPage={canPreviousPage}
//         previousPage={previousPage}
//         gotoPage={gotoPage}
//         gotoLastPage={gotoLastPage}
//       />
//       {showModal && (
//         <IssuePacksModal
//           setShowModal={setShowModal}
//           onIssuePack={handleIssuePack}
//           user={modalRow}
//         />
//       )}
//     </div>
//   )
// }

// export default IssuePacksTable
