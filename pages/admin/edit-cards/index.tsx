import EditCardsTable from '@components/tables/edit-cards-table'
import { useGetAllCards } from '@pages/api/queries'
import React from 'react'

const EditCards = () => {
  const { allCards, isLoading, isError } = useGetAllCards({})

  if (isLoading || isError) {
    return null
  }

  return (
    <div className="m-2">
      <h1>Edit Cards</h1>
      <EditCardsTable tableData={allCards.slice(0, 10)} />
    </div>
  )
}

export default EditCards
