import React from 'react'
import { goalieColumns, skaterColumns } from '@constants/index'
import { onlyGoalieCards, onlySkaterCards } from '@utils/index'
import { DataTable } from '@components/index'
import { useRequestedCards } from '@pages/api/queries/index'

const ClaimCardCreation = () => {
  const { requestedCards, isLoading, isError } = useRequestedCards()

  const skaterCards = onlySkaterCards(requestedCards)
  const goalieCards = onlyGoalieCards(requestedCards)

  return (
    <>
      <DataTable
        title={'Claim a Skater Card'}
        data={skaterCards}
        columns={skaterColumns}
        options={{}}
      />
      <DataTable
        title={'Claim a Goalie Card'}
        data={goalieCards}
        columns={goalieColumns}
        options={{}}
      />
    </>
  )
}

export default ClaimCardCreation
