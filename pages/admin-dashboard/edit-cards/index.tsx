import React from 'react'
import { DataTable } from '@components/index'
import { useAllCards } from '@hooks/index'
import { goalieColumns, skaterColumns } from '@constants/index'
import { onlyGoalieCards, onlySkaterCards } from '@utils/index'

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
        options={{}}
      />
      <DataTable
        title={'Edit Goaltenders'}
        data={goalieCards}
        columns={goalieColumns}
        options={{}}
      />
    </>
  )
}

export default EditCards
