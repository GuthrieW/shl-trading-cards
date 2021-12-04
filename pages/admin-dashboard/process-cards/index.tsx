import React from 'react'
import { DataTable } from '@components/index'
import { goalieColumns, skaterColumns } from '@constants/index'
import { onlyGoalieCards, onlySkaterCards } from '@utils/index'
import { useUnapprovedCards } from '@hooks/index'

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
        options={{}}
      />
      <DataTable
        title={'Process Goaltenders'}
        data={goalieCards}
        columns={goalieColumns}
        options={{}}
      />
    </>
  )
}

export default ProcessCards
