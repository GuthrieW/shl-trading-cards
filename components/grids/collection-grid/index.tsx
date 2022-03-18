import Pagination from '@components/tables/pagination'
import React, { useMemo, useState } from 'react'
import Grid from '../grid'
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from 'react-table'
import MultiSelectButtonGroup from '@components/buttons/multi-select-button-group'
import SearchBar from '@components/inputs/search-bar'
import rarityMap from '@constants/rarity-map'
import orderBy from 'lodash/orderBy'

type CollectionGridProps = {
  gridData: Card[]
}

const CollectionGrid = ({ gridData }: CollectionGridProps) => {
  const [searchString, setSearchString] = useState<string>('')
  const [selectedRarities, setSelectedRarities] = useState<string[]>([])

  const columnData: GridColumn[] = [
    {
      accessor: 'cardID',
    },
    {
      accessor: 'card_rarity',
    },
    {
      accessor: 'image_url',
    },
    {
      accessor: 'overall',
    },
    {
      accessor: 'player_name',
    },
    {
      accessor: 'quantity',
    },
  ]

  const columns = useMemo(() => columnData, [])
  const data = useMemo(() => {
    const lowerCaseSearchString = searchString.toLowerCase()
    let newData: Card[] = gridData

    if (searchString !== '') {
      newData = gridData.filter((card) =>
        card.player_name.toLowerCase().includes(lowerCaseSearchString)
      )
    }

    if (selectedRarities.length !== 0) {
      newData = gridData.filter((card) =>
        selectedRarities.includes(card.card_rarity)
      )
    }

    return orderBy(newData, ['overall'], ['desc'])
  }, [searchString, selectedRarities, gridData])

  const initialState = useMemo(() => {
    return { sortBy: [{ id: 'player_name' }] }
  }, [])

  const {
    page,
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
      initialState: { pageIndex: 0, pageSize: 12, ...initialState },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  const gotoLastPage = () => gotoPage(pageCount - 1)
  const handleUpdateSearchString = (event) =>
    setSearchString(event.target.value || '')

  const updateSelectedButtonIds = (toggleId) =>
    selectedRarities.includes(toggleId)
      ? setSelectedRarities(
          selectedRarities.filter((rarity) => rarity != toggleId)
        )
      : setSelectedRarities(selectedRarities.concat(toggleId))

  const tableButtons: CollectionTableButtons[] = [
    {
      id: rarityMap.bronze.label,
      text: rarityMap.bronze.label,
      onClick: () => updateSelectedButtonIds(rarityMap.bronze.label),
    },
    {
      id: rarityMap.silver.label,
      text: rarityMap.silver.label,
      onClick: () => updateSelectedButtonIds(rarityMap.silver.label),
    },
    {
      id: rarityMap.gold.label,
      text: rarityMap.gold.label,
      onClick: () => updateSelectedButtonIds(rarityMap.gold.label),
    },
    {
      id: rarityMap.ruby.label,
      text: rarityMap.ruby.label,
      onClick: () => updateSelectedButtonIds(rarityMap.ruby.label),
    },
    {
      id: rarityMap.diamond.label,
      text: rarityMap.diamond.label,
      onClick: () => updateSelectedButtonIds(rarityMap.diamond.label),
    },
  ]

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full flex justify-between items-center">
        <MultiSelectButtonGroup
          buttons={tableButtons}
          selectedButtonIds={selectedRarities}
        />
        <SearchBar onChange={handleUpdateSearchString} />
      </div>
      <div className="flex flex-col justify-center items-center">
        <Grid cards={page} prepareCell={prepareRow} onCellClick={() => {}} />
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
    </div>
  )
}

export default CollectionGrid
