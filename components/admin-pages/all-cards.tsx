import AllCardsTable from '@components/tables/all-cards-table'
import useGetAllCards from '@pages/api/queries/use-get-all-cards'
import { NextSeo } from 'next-seo'
import React from 'react'

const AllCards = () => {
  const { allCards, isLoading, isError } = useGetAllCards({})
  if (isLoading || isError) return null

  return (
    <>
      <NextSeo title="All Cards" />
      <div className="m-2">
        <AllCardsTable tableData={allCards} />
      </div>
    </>
  )
}

export default AllCards
