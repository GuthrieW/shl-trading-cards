import IssuePacksTable from '@components/tables/issue-packs-table'
import { useGetAllUsers } from '@pages/api/queries'
import { NextSeo } from 'next-seo'
import React from 'react'

const IssuePacks = () => {
  const { users, isSuccess, isLoading, isError } = useGetAllUsers({})
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
