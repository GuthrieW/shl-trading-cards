import ProcessCardsTable from '@components/tables/process-cards-table'
import useGetUnapprovedCards from '@pages/api/queries/use-get-unapproved-cards'
import { NextSeo } from 'next-seo'
import React from 'react'

const ProcessCards = () => {
  const { unapprovedCards, isLoading, isError } = useGetUnapprovedCards({})
  if (isLoading || isError) return null

  return (
    <>
      <NextSeo title="Process Cards" />
      <div className="m-2">
        <ProcessCardsTable tableData={unapprovedCards} />
      </div>
    </>
  )
}

export default ProcessCards
