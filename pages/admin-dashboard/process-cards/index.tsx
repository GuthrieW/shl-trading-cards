import React from 'react'
import DataTable from '@components/data-table'
import goalieColumns from 'constants/goalie-columns'
import skaterColumns from 'constants/skater-columns'
import onlySkaterCards from '@utils/only-skater-cards'
import onlyGoalieCards from '@utils/only-goalie-cards'
import useUnapprovedCards from '@hooks/use-unapproved-cards'

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
  const { unapprovedCards, isLoading, isError } = useUnapprovedCards()

  const skaterCards = onlySkaterCards(unapprovedCards)
  const goalieCards = onlyGoalieCards(unapprovedCards)

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
