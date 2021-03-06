import React from 'react'
import DataTable from '@components/data-table'
import testCards from '@utils/test-data/cards.json'
import goalieColumns from '@utils/constants/goalie-columns-buttons'
import skaterColumns from '@utils/constants/skater-columns-buttons'

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
        columns={skaterColumns}
        options={options}
      />
      <DataTable
        title={'Edit Goaltenders'}
        data={goalieCards}
        columns={goalieColumns}
        options={options}
      />
    </>
  )
}

export default EditCards
