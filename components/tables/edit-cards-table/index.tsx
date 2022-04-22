import ButtonGroup from '@components/buttons/button-group'
import SearchBar from '@components/inputs/search-bar'
import EditCardModal from '@components/modals/edit-card-modal'
import { warningToast } from '@hooks/use-toast'
import { useEditCard } from '@pages/api/mutations'
import React, { useMemo, useState } from 'react'
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from 'react-table'
import Pagination from '../pagination'
import Table from '../table'

export type EditCardTableProps = {
  tableData: Card[]
}

type ColumnData = {
  id: string
  Header: string
  accessor: string
  title: string
  sortDescFirst: boolean
}

const EditCardsTable = ({ tableData }: EditCardTableProps) => {
  const { editCard, response, isSuccess, isLoading, isError } = useEditCard()

  const [viewSkaters, setViewSkaters] = useState<boolean>(true)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedButtonId, setSelectedButtonId] =
    useState<PlayerTableButtonId>('skaters')
  const [modalRow, setModalRow] = useState<Card>(null)

  const columnData: ColumnData[] = [
    {
      id: 'player_name',
      Header: 'Name',
      accessor: 'player_name',
      title: 'Player Name',
      sortDescFirst: false,
    },
    {
      id: 'cardID',
      Header: 'Card ID',
      accessor: 'cardID',
      title: 'Card ID',
      sortDescFirst: true,
    },
    {
      id: 'playerID',
      Header: 'Player ID',
      accessor: 'playerID',
      title: 'Player ID',
      sortDescFirst: true,
    },
    {
      id: 'teamID',
      Header: 'Team ID',
      accessor: 'teamID',
      title: 'Team ID',
      sortDescFirst: true,
    },
    {
      id: 'author_userID',
      Header: 'Author ID',
      accessor: 'author_userID',
      title: 'Author ID',
      sortDescFirst: true,
    },
    {
      id: 'pullable',
      Header: 'Pullable',
      accessor: 'pullable',
      title: 'Pullable',
      sortDescFirst: true,
    },
    {
      id: 'approved',
      Header: 'Approved',
      accessor: 'approved',
      title: 'Approved',
      sortDescFirst: true,
    },
    {
      id: 'author_paid',
      Header: 'Paid',
      accessor: 'author_paid',
      title: 'Author Paid',
      sortDescFirst: true,
    },
    {
      id: 'image_url',
      Header: 'Image',
      accessor: 'image_url',
      title: 'Image URL',
      sortDescFirst: true,
    },
    {
      id: 'card_rarity',
      Header: 'Rarity',
      accessor: 'card_rarity',
      title: 'Rarity',
      sortDescFirst: true,
    },
    {
      id: 'season',
      Header: 'Season',
      accessor: 'season',
      title: 'Season',
      sortDescFirst: true,
    },
    {
      id: 'position',
      Header: 'Pos',
      accessor: 'position',
      title: 'Position',
      sortDescFirst: true,
    },
    {
      id: 'overall',
      Header: 'OVR',
      accessor: 'overall',
      title: 'Overall',
      sortDescFirst: true,
    },
    {
      id: viewSkaters ? 'skating' : 'high_shots',
      Header: viewSkaters ? 'SKA' : 'HSHT',
      accessor: viewSkaters ? 'skating' : 'high_shots',
      title: viewSkaters ? 'Skating' : 'High Shots',
      sortDescFirst: true,
    },
    {
      id: viewSkaters ? 'shooting' : 'low_shots',
      Header: viewSkaters ? 'SHT' : 'LSHT',
      accessor: viewSkaters ? 'shooting' : 'low_shots',
      title: viewSkaters ? 'Shooting' : 'Low Shots',
      sortDescFirst: true,
    },
    {
      id: viewSkaters ? 'hands' : 'quickness',
      Header: viewSkaters ? 'HND' : 'QUI',
      accessor: viewSkaters ? 'hands' : 'quickness',
      title: viewSkaters ? 'Hands' : 'Quickness',
      sortDescFirst: true,
    },
    {
      id: viewSkaters ? 'checking' : 'control',
      Header: viewSkaters ? 'CHK' : 'CTL',
      accessor: viewSkaters ? 'checking' : 'control',
      title: viewSkaters ? 'Checking' : 'Control',
      sortDescFirst: true,
    },
    {
      id: viewSkaters ? 'defense' : 'conditioning',
      Header: viewSkaters ? 'DEF' : 'CND',
      accessor: viewSkaters ? 'defense' : 'conditioning',
      title: viewSkaters ? 'Defense' : 'Conditioning',
      sortDescFirst: true,
    },
  ]

  const columns = useMemo(() => columnData, [viewSkaters])
  const data = useMemo(
    () =>
      viewSkaters
        ? tableData.filter((card) => card.position !== 'G')
        : tableData.filter((card) => card.position === 'G'),
    [tableData, viewSkaters]
  )
  const initialState = useMemo(() => {
    return { sortBy: [{ id: 'player_name' }] }
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

  const tableButtons: PlayerTableButtons[] = [
    {
      id: 'skaters',
      text: 'Skaters',
      disabled: viewSkaters,
      onClick: () => {
        setSelectedButtonId('skaters')
        setViewSkaters(true)
      },
    },
    {
      id: 'goalies',
      text: 'Goalies',
      disabled: !viewSkaters,
      onClick: () => {
        setSelectedButtonId('goalies')
        setViewSkaters(false)
      },
    },
  ]

  const gotoLastPage = () => gotoPage(pageCount - 1)
  const updateSearchFilter = (event) => setGlobalFilter(event.target.value)
  const handleRowClick = (row) => {
    setModalRow(row.values)
    setShowModal(true)
  }

  const handleEditCard = (newCardData) => {
    if (isLoading) {
      warningToast({ warningText: 'Already editing a card' })
    }
    const result = editCard({ card: newCardData })
    console.log('result', result)
  }

  console.log('response', response)

  return (
    <div>
      <div className="flex justify-between items-center">
        <ButtonGroup
          buttons={tableButtons}
          selectedButtonId={selectedButtonId}
        />
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
        <EditCardModal
          cardData={modalRow}
          setShowModal={setShowModal}
          onSubmit={handleEditCard}
          cardID={modalRow.cardID}
          cardName={modalRow.player_name}
        />
      )}
    </div>
  )
}

export default EditCardsTable
