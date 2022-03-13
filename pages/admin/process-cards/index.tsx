import ProcessCardsTable from '@components/tables/process-cards-table'
import { useGetUnapprovedCards } from '@pages/api/queries'
import React from 'react'

const ProcessCards = () => {
  const { unapprovedCards, isLoading, isError } = useGetUnapprovedCards({})

  if (isLoading || isError) return null

  return (
    <div className="m-2">
      <h1>Process Cards</h1>
      <ProcessCardsTable tableData={unapprovedCards} />
    </div>
  )
}

export default ProcessCards
