import React from 'react'
import DataTable from '../../../components/Tables/DataTable'
import testCards from '../../../utils/testData/cards.json'
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
        columns={SkaterColumns}
        options={options}
      />
      <DataTable
        title={'Process Goaltenders'}
        data={goalieCards}
        columns={GoalieColumns}
        options={options}
      />
    </>
  )
}

export default ProcessCards
