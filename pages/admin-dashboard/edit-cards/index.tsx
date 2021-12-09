import React from 'react'
import { DataTable } from '@components/index'
import { useAllCards } from '@pages/api/queries/index'
import { goalieColumns, skaterColumns } from '@constants/index'
import { onlyGoalieCards, onlySkaterCards } from '@utils/index'

const EditCards = () => {
  const { allCards, isLoading, isError } = useAllCards()

  const skaterCards = onlySkaterCards(allCards)
  const goalieCards = onlyGoalieCards(allCards)

  return (
    <>
      <DataTable
        title={'Edit a Skater Card'}
        data={skaterCards}
        columns={skaterColumns}
        options={{}}
      />
      <DataTable
        title={'Edit a Goalie Card'}
        data={goalieCards}
        columns={goalieColumns}
        options={{}}
      />
    </>
  )
}

export default EditCards
