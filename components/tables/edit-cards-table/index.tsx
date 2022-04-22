import ButtonGroup from '@components/buttons/button-group'
import SearchBar from '@components/inputs/search-bar'
import EditCardModal from '@components/modals/edit-card-modal'
import useToast, { warningToast } from '@hooks/use-toast'
import { useEditCard } from '@pages/api/mutations'
import React, { useEffect, useMemo, useState } from 'react'
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from 'react-table'
import Pagination from '../pagination'
import Table from '../table'
import attributesMap from '@constants/attributes-map'

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

  useToast({
    successText: 'Edited Card',
    successDependencies: [isSuccess],
    errorText: 'Error Editing Card',
    errorDependencies: [isError],
  })

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
      id: viewSkaters
        ? attributesMap.skating.name
        : attributesMap.highShots.name,
      Header: viewSkaters
        ? attributesMap.skating.abbreviation
        : attributesMap.highShots.abbreviation,
      accessor: viewSkaters
        ? attributesMap.skating.name
        : attributesMap.highShots.name,
      title: viewSkaters
        ? attributesMap.skating.label
        : attributesMap.highShots.label,
      sortDescFirst: true,
    },
    {
      id: viewSkaters
        ? attributesMap.shooting.name
        : attributesMap.lowShots.name,
      Header: viewSkaters
        ? attributesMap.shooting.abbreviation
        : attributesMap.lowShots.abbreviation,
      accessor: viewSkaters
        ? attributesMap.shooting.name
        : attributesMap.lowShots.name,
      title: viewSkaters
        ? attributesMap.shooting.label
        : attributesMap.lowShots.label,
      sortDescFirst: true,
    },
    {
      id: viewSkaters ? attributesMap.hands.name : attributesMap.quickness.name,
      Header: viewSkaters
        ? attributesMap.hands.abbreviation
        : attributesMap.quickness.abbreviation,
      accessor: viewSkaters
        ? attributesMap.hands.name
        : attributesMap.quickness.name,
      title: viewSkaters
        ? attributesMap.hands.label
        : attributesMap.quickness.label,
      sortDescFirst: true,
    },
    {
      id: viewSkaters
        ? attributesMap.checking.name
        : attributesMap.control.name,
      Header: viewSkaters
        ? attributesMap.checking.abbreviation
        : attributesMap.control.abbreviation,
      accessor: viewSkaters
        ? attributesMap.checking.name
        : attributesMap.control.name,
      title: viewSkaters
        ? attributesMap.checking.label
        : attributesMap.control.label,
      sortDescFirst: true,
    },
    {
      id: viewSkaters
        ? attributesMap.defense.name
        : attributesMap.conditioning.name,
      Header: viewSkaters
        ? attributesMap.defense.abbreviation
        : attributesMap.conditioning.abbreviation,
      accessor: viewSkaters
        ? attributesMap.defense.name
        : attributesMap.conditioning.name,
      title: viewSkaters
        ? attributesMap.defense.label
        : attributesMap.conditioning.label,
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

  const handleEditCard = (cardID, newCardData) => {
    if (isLoading) {
      warningToast({ warningText: 'Already editing a card' })
    }
    editCard({ cardID, newCardData })
  }

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
