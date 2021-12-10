import React from 'react'
import { claimingGoalieColumns, claimingSkaterColumns } from '@constants/index'
import { onlyGoalieCards, onlySkaterCards } from '@utils/index'
import { DataTable } from '@components/index'
import { useGetRequestedCards } from '@pages/api/queries/index'

const ClaimCardCreation = () => {
  const { requestedCards, isLoading, isError } = useGetRequestedCards()

  const skaterCards = onlySkaterCards(requestedCards)
  const goalieCards = onlyGoalieCards(requestedCards)

  return (
    <>
      <DataTable
        title={'Claim a Skater Card'}
        data={skaterCards}
        columns={claimingGoalieColumns}
        options={{}}
      />
      <DataTable
        title={'Claim a Goalie Card'}
        data={goalieCards}
        columns={claimingSkaterColumns}
        options={{}}
      />
    </>
  )
}

export default ClaimCardCreation
