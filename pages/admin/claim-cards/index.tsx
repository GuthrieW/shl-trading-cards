import ClaimCardsTable from '@components/tables/claim-cards-table'
import { useGetRequestedCards } from '@pages/api/queries'
import { NextSeo } from 'next-seo'
import React from 'react'

const ClaimCards = () => {
  const { requestedCards, isLoading, isError } = useGetRequestedCards({})

  if (isLoading || isError) return null

  return (
    <>
      <NextSeo title="Claim Cards" />
      <div className="m-2">
        <h1>Claim Cards</h1>
        <ClaimCardsTable tableData={requestedCards} />
      </div>
    </>
  )
}

export default ClaimCards
