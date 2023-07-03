import EditCardsTable from '@components/tables/edit-cards-table'
import useGetAllCards from '@pages/api/queries/use-get-all-cards'
import { NextSeo } from 'next-seo'
import React from 'react'

const EditCards = () => {
  const { allCards, isLoading, isError } = useGetAllCards({})
  if (isLoading || isError) return null

  return (
    <>
      <NextSeo title="Edit Cards" />
      <div className="m-2">
        <EditCardsTable tableData={allCards} />
      </div>
    </>
  )
}

export default EditCards
