import React from 'react'
import DataTable from '../../../components/Tables/DataTable'
import testCards from '../../../utils/testData/cards.json'

const columns = [
  'playerName',
  'teamCity',
  'teamName',
  'position',
  'rarity',
  'imageUrl',
]

const options = {
  filterType: 'dropdown',
  download: false,
  print: false,
  selectableRows: 'none',
  onRowClick: (rowData) => {
    return
  },
}

const EditCards = () => {
  return (
    <DataTable
      title={'Edit Cards'}
      data={testCards.data}
      columns={columns}
      options={options}
    />
  )
}

export default EditCards
