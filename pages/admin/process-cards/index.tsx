import ProcessCardsTable from '@components/tables/process-cards-table'
import { useGetUnapprovedCards, useGetUser } from '@pages/api/queries'
import getUidFromSession from '@utils/get-uid-from-session'
import isAdmin from '@utils/is-admin'
import isAdminOrCardTeam from '@utils/is-admin-or-card-team'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import React from 'react'

const ProcessCards = () => {
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

  const { unapprovedCards, isLoading, isError } = useGetUnapprovedCards({})

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
      <NextSeo title="Process Cards" />
      <div className="m-2">
        <h1>Process Cards</h1>
        <ProcessCardsTable tableData={unapprovedCards} />
      </div>
    </>
  )
}

export default ProcessCards
