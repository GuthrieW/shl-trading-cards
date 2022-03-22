import SubmitCardsTable from '@components/tables/submit-cards-table'
import { useGetClaimedCards } from '@pages/api/queries'
import getUidFromSession from '@utils/get-uid-from-session'
import React from 'react'

const SubmitCards = () => {
  const { claimedCards, isLoading, isError } = useGetClaimedCards({
    uid: getUidFromSession(),
  })

  if (isLoading || isError) return null

  return (
    <div className="m-2">
      <h1>Submit Cards</h1>
      <SubmitCardsTable tableData={claimedCards} />
    </div>
  )
}

export default SubmitCards
