import ClaimCardsTable from '@components/tables/claim-cards-table'
import useGetRequestedCards from '@pages/api/queries/use-get-requested-cards'
import useGetUser from '@pages/api/queries/use-get-user'
import getUidFromSession from '@utils/get-uid-from-session'
import isAdmin from '@utils/user-groups/is-admin'
import isAdminOrCardTeam from '@utils/user-groups/is-admin-or-card-team'
import { NextSeo } from 'next-seo'
import Router from 'next/router'
import React from 'react'

const ClaimCards = () => {
  const parsedUid = getUidFromSession()

  const {
    user,
    isSuccess: getUserIsSuccess,
    isLoading: getUserIsLoading,
    isError: getUserIsError,
  } = useGetUser({
    uid: parsedUid,
  })

  const { requestedCards, isLoading, isError } = useGetRequestedCards({})

  if (getUserIsLoading || getUserIsError) return null

  const userIsAdminOrCardTeam = isAdminOrCardTeam(user)

  if (!userIsAdminOrCardTeam) {
    Router.push('/')
    return null
  }

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
