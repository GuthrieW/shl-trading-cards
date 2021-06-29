import React from 'react'
import testCards from '@utils/test-data/cards.json'
import DataTable from '@components/data-table'
import goalieColumns from '@utils/constants/goalie-columns'
import skaterColumns from '@utils/constants/skater-columns'

const options = {
  filterType: 'dropdown',
  download: false,
  print: false,
  selectableRows: 'none',
  onRowClick: (rowData) => {
    return
  },
  responsive: 'simple',
}

const SearchCards = () => {
  const skaterCards = testCards.data.filter((card) => {
    return card.position !== 'G'
  })
  const goalieCards = testCards.data.filter((card) => {
    return card.position === 'G'
  })

  return (
    <>
      <DataTable
        title={'Search for Skaters'}
        data={skaterCards}
        columns={skaterColumns}
        options={options}
      />
      <DataTable
        title={'Search for Goaltenders'}
        data={goalieCards}
        columns={goalieColumns}
        options={options}
      />
    </>
  )
}

export default SearchCards
