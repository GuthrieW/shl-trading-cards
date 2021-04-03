import React from 'react'
import testCards from '../../../utils/testData/cards.json'
import DataTable from '../../../components/Tables/DataTable'

const columns = ['playerName', 'teamCity', 'teamName', 'position', 'rarity']

const options = {
  filterType: 'dropdown',
  download: false,
  print: false,
  selectableRows: 'none',
  onRowClick: (rowData) => {
    return
  },
}

const SearchCards = () => {
  return (
    <DataTable
      title={'Search for Cards'}
      data={testCards.data}
      columns={columns}
      options={options}
    />
  )
}

export default SearchCards
