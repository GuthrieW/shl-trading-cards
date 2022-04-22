import SubmitCardsTable from '@components/tables/submit-cards-table'
import { useGetClaimedCards, useGetUser } from '@pages/api/queries'
import getUidFromSession from '@utils/get-uid-from-session'
import isAdmin from '@utils/is-admin'
import isAdminOrCardTeam from '@utils/is-admin-or-card-team'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import React from 'react'

const SubmitCards = () => {
  const parsedUid = getUidFromSession()
  const router = useRouter()

  const {
    user,
    isSuccess: getUserIsSuccess,
    isLoading: getUserIsLoading,
    isError: getUserIsError,
  } = useGetUser({
    uid: parsedUid,
  })

  const { claimedCards, isLoading, isError } = useGetClaimedCards({
    uid: getUidFromSession(),
  })

  if (getUserIsLoading || getUserIsError) return null

  const userIsAdmin = isAdmin(user)
  const userIsAdminOrCardTeam = isAdminOrCardTeam(user)

  if (!userIsAdminOrCardTeam) {
    router.push('/')
    return null
  }

  if (isLoading || isError) return null

  return (
    <>
      <NextSeo title="Submit Cards" />
      <div className="m-2">
        <h1>Submit Cards</h1>
        <SubmitCardsTable tableData={claimedCards} />
      </div>
    </>
  )
}

export default SubmitCards
