import ProcessCardsTable from '@components/tables/process-cards-table'
import useGetUser from '@pages/api/queries/use-get-user'
import useGetUnapprovedCards from '@pages/api/queries/use-get-unapproved-cards'
import getUidFromSession from '@utils/get-uid-from-session'
import isAdmin from '@utils/user-groups/is-admin'
import isAdminOrCardTeam from '@utils/user-groups/is-admin-or-card-team'
import { NextSeo } from 'next-seo'
import Router from 'next/router'
import React from 'react'

const ProcessCards = () => {
  const parsedUid = getUidFromSession()

  const {
    user,
    isSuccess: getUserIsSuccess,
    isLoading: getUserIsLoading,
    isError: getUserIsError,
  } = useGetUser({
    uid: parsedUid,
  })

  const { unapprovedCards, isLoading, isError } = useGetUnapprovedCards({})

  if (getUserIsLoading || getUserIsError) return null

  const userIsAdminOrCardTeam = isAdminOrCardTeam(user)

  if (!userIsAdminOrCardTeam) {
    Router.push('/')
    return null
  }

  if (isLoading || isError) return null

  return (
    <>
      <NextSeo title="Process Cards" />
      <div className="m-2">
        <h1>Process Cards</h1>
        <ProcessCardsTable tableData={unapprovedCards} />
      </div>
    </>
  )
}

export default ProcessCards
