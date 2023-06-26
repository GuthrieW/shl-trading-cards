import SubmitCardsTable from '@components/tables/submit-cards-table'
import useGetUser from '@pages/api/queries/use-get-user'
import useGetClaimedCards from '@pages/api/queries/use-get-claimed-cards'
import getUidFromSession from '@utils/get-uid-from-session'
import isAdmin from '@utils/user-groups/is-admin'
import isAdminOrCardTeam from '@utils/user-groups/is-admin-or-card-team'
import { NextSeo } from 'next-seo'
import Router from 'next/router'
import React from 'react'

const SubmitCards = () => {
  const parsedUid = getUidFromSession()

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
    Router.push('/')
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
