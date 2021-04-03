import React from 'react'
import DataTable from '../../../components/Tables/DataTable'
import testCards from '../../../utils/testData/cards.json'
import { SkaterColumns } from './SkaterColumns'
import { GoalieColumns } from './GoalieColumns'

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

const EditCards = () => {
  const skaterCards = testCards.data.filter((card) => {
    return card.position !== 'G'
  })
  const goalieCards = testCards.data.filter((card) => {
    return card.position === 'G'
  })

  return (
    <>
      <DataTable
        title={'Edit Skaters'}
        data={skaterCards}
        columns={SkaterColumns}
        options={options}
      />
      <DataTable
        title={'Edit Goaltenders'}
        data={goalieCards}
        columns={GoalieColumns}
        options={options}
      />
    </>
  )
}

export default EditCards
