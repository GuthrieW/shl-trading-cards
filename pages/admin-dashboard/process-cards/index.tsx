import React from 'react'
import { DataTable } from '@components/index'
import {
  processingGoalieColumns,
  processingSkaterColumns,
} from '@constants/index'
import { onlyGoalieCards, onlySkaterCards } from '@utils/index'
import { useGetUnapprovedCards } from '@pages/api/queries/index'

const ProcessCards = () => {
  const { unapprovedCards, isLoading, isError } = useGetUnapprovedCards()

  const skaterCards = onlySkaterCards(unapprovedCards)
  const goalieCards = onlyGoalieCards(unapprovedCards)

  return (
    <>
      <DataTable
        title={'Process Skater Cards'}
        data={skaterCards}
        columns={processingSkaterColumns}
        options={{}}
      />
      <DataTable
        title={'Process Goalie Cards'}
        data={goalieCards}
        columns={processingGoalieColumns}
        options={{}}
      />
    </>
  )
}

export default ProcessCards
