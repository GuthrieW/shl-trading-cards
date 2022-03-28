import ClaimCardsTable from '@components/tables/claim-cards-table'
import { useGetRequestedCards, useGetUser } from '@pages/api/queries'
import getUidFromSession from '@utils/get-uid-from-session'
import isAdmin from '@utils/is-admin'
import isAdminOrCardTeam from '@utils/is-admin-or-card-team'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import React from 'react'

const ClaimCards = () => {
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

  if (getUserIsLoading || getUserIsError) return null

  const userIsAdmin = isAdmin(user)
  const userIsAdminOrCardTeam = isAdminOrCardTeam(user)

  if (!userIsAdminOrCardTeam) {
    router.push('/')
    return null
  }

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
