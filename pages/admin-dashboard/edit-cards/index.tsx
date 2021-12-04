import React from 'react'
import DataTable from '@components/data-table'
import goalieColumns from 'constants/goalie-columns-buttons'
import skaterColumns from 'constants/skater-columns-buttons'
import useAllCards from '@hooks/use-approved-cards'
import onlySkaterCards from '@utils/only-skater-cards'
import onlyGoalieCards from '@utils/only-goalie-cards'

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
  const { allCards, isLoading, isError } = useAllCards()

  const skaterCards = onlySkaterCards(allCards)
  const goalieCards = onlyGoalieCards(allCards)

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
