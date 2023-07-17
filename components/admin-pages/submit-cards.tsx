import SubmitCardsTable from '@components/tables/submit-cards-table'
import useGetClaimedCards from '@pages/api/queries/use-get-claimed-cards'
import { NextSeo } from 'next-seo'
import React from 'react'

export type SubmitCardsProps = {
  user: User
}

const SubmitCards = ({ user }: SubmitCardsProps) => {
  const { claimedCards, isLoading, isError } = useGetClaimedCards({
    uid: user.uid,
  })
  if (isLoading || isError) return null

  return (
    <>
      <NextSeo title="Submit Cards" />
      <div className="m-2">
        <SubmitCardsTable tableData={claimedCards} />
      </div>
    </>
  )
}

export default SubmitCards
