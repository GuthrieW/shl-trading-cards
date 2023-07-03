import IssuePacksTable from '@components/tables/issue-packs-table'
import useGetAllUsers from '@pages/api/queries/use-get-all-users'
import { NextSeo } from 'next-seo'
import React from 'react'

const IssuePacks = () => {
  const { users, isSuccess, isLoading, isError } = useGetAllUsers({})
  if (isLoading || isError) {
    return null
  }

  return (
    <>
      <NextSeo title="Issue Packs" />
      <div className="m-2">
        <IssuePacksTable tableData={users} />
      </div>
    </>
  )
}

export default IssuePacks
