import React from 'react'
import { DataTable } from '@components/index'
import {
  goalieColumnsWithButtons,
  skaterColumnsWithButtons,
} from '@constants/index'
import { onlyGoalieCards, onlySkaterCards } from '@utils/index'
import { useUnapprovedCards } from '@hooks/index'

const ProcessCards = () => {
  const { unapprovedCards, isLoading, isError } = useUnapprovedCards()

  const skaterCards = onlySkaterCards(unapprovedCards)
  const goalieCards = onlyGoalieCards(unapprovedCards)

  return (
    <>
      <DataTable
        title={'Process Skater Cards'}
        data={skaterCards}
        columns={skaterColumnsWithButtons}
        options={{}}
      />
      <DataTable
        title={'Process Goalie Cards'}
        data={goalieCards}
        columns={goalieColumnsWithButtons}
        options={{}}
      />
    </>
  )
}

export default ProcessCards
