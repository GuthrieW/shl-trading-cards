import AllCardsTable from '@components/tables/all-cards-table'
import useGetAllCards from '@pages/api/queries/use-get-all-cards'
import useGetUser from '@pages/api/queries/use-get-user'
import getUidFromSession from '@utils/get-uid-from-session'
import isAdmin from '@utils/user-groups/is-admin'
import isAdminOrCardTeam from '@utils/user-groups/is-admin-or-card-team'

import { NextSeo } from 'next-seo'
import Router from 'next/router'
import React from 'react'

const AllCards = () => {
  const parsedUid = getUidFromSession()

  const {
    user,
    isSuccess: getUserIsSuccess,
    isLoading: getUserIsLoading,
    isError: getUserIsError,
  } = useGetUser({
    uid: parsedUid,
  })

  const { allCards, isLoading, isError } = useGetAllCards({})

  if (getUserIsLoading || getUserIsError) return null

  const userIsAdminOrCardTeam = isAdminOrCardTeam(user)

  if (!userIsAdminOrCardTeam) {
    Router.push('/')
    return null
  }

  if (isLoading || isError) return null

  return (
    <>
      <NextSeo title="All Cards" />
      <div className="m-2">
        <h1>All Cards</h1>
        <AllCardsTable tableData={allCards} />
      </div>
    </>
  )
}

export default AllCards
