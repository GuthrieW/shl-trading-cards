import IssuePacksTable from '@components/tables/issue-packs-table'
import useGetAllUsers from '@pages/api/queries/use-get-all-users'
import useGetUser from '@pages/api/queries/use-get-user'
import getUidFromSession from '@utils/get-uid-from-session'
import isAdmin from '@utils/user-groups/is-admin'
import isAdminOrCardTeam from '@utils/user-groups/is-admin-or-card-team'
import { NextSeo } from 'next-seo'
import Router from 'next/router'
import React from 'react'

const IssuePacks = () => {
  const parsedUid = getUidFromSession()

  const {
    user,
    isSuccess: getUserIsSuccess,
    isLoading: getUserIsLoading,
    isError: getUserIsError,
  } = useGetUser({
    uid: parsedUid,
  })

  const { users, isSuccess, isLoading, isError } = useGetAllUsers({})

  if (getUserIsLoading || getUserIsError) return null

  const userIsAdmin = isAdmin(user)

  if (!userIsAdmin) {
    Router.push('/')
    return null
  }

  if (isLoading || isError) {
    return null
  }

  return (
    <>
      <NextSeo title="Issue Packs" />
      <div className="m-2">
        <h1>Issue Packs</h1>
        <IssuePacksTable tableData={users} />
      </div>
    </>
  )
}

export default IssuePacks
