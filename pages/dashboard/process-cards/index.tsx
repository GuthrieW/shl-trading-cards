import React from 'react'
import DataTable from '@components/tables/data-table'
import testCards from '@utils/test-data/cards.json'
import { goalieColumns } from './goalie-columns'
import { skaterColumns } from './skater-columns'

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

const ProcessCards = () => {
  const skaterCards = testCards.data.filter((card) => {
    return card.position !== 'G'
  })
  const goalieCards = testCards.data.filter((card) => {
    return card.position === 'G'
  })

  return (
    <>
      <DataTable
        title={'Process Skaters'}
        data={skaterCards}
        columns={skaterColumns}
        options={options}
      />
      <DataTable
        title={'Process Goaltenders'}
        data={goalieCards}
        columns={goalieColumns}
        options={options}
      />
    </>
  )
}

export default ProcessCards
