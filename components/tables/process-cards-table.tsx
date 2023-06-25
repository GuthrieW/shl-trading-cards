import React, { useMemo, useState } from 'react'
import ButtonGroup from '@components/buttons/button-group'
import SearchBar from '@components/inputs/search-bar'
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from 'react-table'
import Pagination from './pagination'
import Table from './table'
import ProcessCardModal from '@components/modals/process-card-modal'
import useAcceptCard from '@pages/api/mutations/use-accept-card'
import useDenyCard from '@pages/api/mutations/use-deny-card'
import { warningToast } from '@utils/toasts'
import attributesMap from '@constants/attributes-map'

type ProcessCardsTableProps = {
  tableData: Card[]
}

const ProcessCardsTable = ({ tableData }: ProcessCardsTableProps) => {
  const [viewSkaters, setViewSkaters] = useState<boolean>(true)
  const [selectedButtonId, setSelectedButtonId] =
    useState<PlayerTableButtonId>('skaters')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalRow, setModalRow] = useState<Card>(null)

  const {
    acceptCard,
    isSuccess: acceptCardIsSuccess,
    isLoading: acceptCardIsLoading,
    isError: acceptCardIsError,
  } = useAcceptCard()

  const {
    denyCard,
    isSuccess: denyCardIsSuccess,
    isLoading: denyCardIsLoading,
    isError: denyCardIsError,
  } = useDenyCard()

  const columnData = [
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
      id: 'image_url',
      Header: 'Image URL',
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
      id: 'sub_type',
      Header: 'Sub Type',
      accessor: 'sub_type',
      title: 'Sub Type',
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
      id: attributesMap.overall.name,
      Header: attributesMap.overall.abbreviation,
      accessor: attributesMap.overall.name,
      title: attributesMap.overall.label,
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

  const handleAcceptCard = () => {
    if (acceptCardIsLoading) {
      warningToast({ warningText: 'Already accepting a card' })
      return
    }
    acceptCard({ cardID: modalRow.cardID })
  }

  const handleDenyCard = () => {
    if (denyCardIsLoading) {
      warningToast({ warningText: 'Already denying a card' })
      return
    }
    denyCard({ cardID: modalRow.cardID })
  }

  const handleRowClick = (row) => {
    setModalRow(row.values)
    setShowModal(true)
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
        <ProcessCardModal
          setShowModal={setShowModal}
          onAccept={handleAcceptCard}
          onDeny={handleDenyCard}
          card={modalRow}
        />
      )}
    </div>
  )
}

export default ProcessCardsTable
