import ButtonGroup from '@components/buttons/button-group'
import SearchBar from '@components/inputs/search-bar'
import React, { useMemo, useState } from 'react'
import { useTable, useSortBy, usePagination } from 'react-table'
import Pagination from '../pagination'
import Table from '../table'

type ColumnData = {
  id: string
  Header: string
  accessor: string
  title: string
  sortDescFirst: boolean
}

export type EditCardTableProps = {
  tableData: Card[]
}

const EditCardsTable = ({ tableData }: EditCardTableProps) => {
  const [viewSkaters, setViewSkaters] = useState<boolean>(true)

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

  const columns = useMemo(() => columnData, [columnData])
  const data = useMemo(() => tableData, [tableData])
  const initialState = useMemo(() => {
    return { sortBy: [{ id: 'cardID' }] }
  }, [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    pageOptions,
    pageCount,
    canPreviousPage,
    previousPage,
    canNextPage,
    nextPage,
    gotoPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10, ...initialState },
    },
    useSortBy,
    usePagination
  )

  const gotoLastPage = () => gotoPage(pageCount - 1)

  const tableButtons = [
    {
      id: 'skaters',
      text: 'Skaters',
      disabled: viewSkaters,
      onClick: () => {
        setViewSkaters(true)
      },
    },
    {
      id: 'goalies',
      text: 'Goalies',
      disabled: !viewSkaters,
      onClick: () => {
        setViewSkaters(false)
      },
    },
  ]

  return (
    <div>
      <div className="flex justify-between">
        <ButtonGroup
          buttons={tableButtons}
          selectedButtonId={tableButtons[0].id}
        />
        <SearchBar onChange={() => {}} />
      </div>
      <Table
        getTableProps={getTableProps}
        headerGroups={headerGroups}
        getTableBodyProps={getTableBodyProps}
        rows={rows}
        prepareRow={prepareRow}
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

export default EditCardsTable
