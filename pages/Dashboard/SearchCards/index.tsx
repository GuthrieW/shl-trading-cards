import React from 'react'
import testCards from '../../../utils/testData/cards.json'
import DataTable from '../../../components/Tables/DataTable'
import { GoalieColumns } from './GoalieColumns'
import { SkaterColumns } from './SkaterColumns'

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
        columns={SkaterColumns}
        options={options}
      />
      <DataTable
        title={'Search for Goaltenders'}
        data={goalieCards}
        columns={GoalieColumns}
        options={options}
      />
    </>
  )
}

export default SearchCards
