import UserGrid from '@components/grids/user-grid'
import CommunityTable from '@components/tables/community-table'
import useGetAllUsersWithCards from '@pages/api/queries/use-get-all-users-with-cards'
import { NextSeo } from 'next-seo'
import React from 'react'

const Community = () => {
  const {
    users,
    isLoading: getAllUsersIsLoading,
    isError: getAllUsersIsError,
  } = useGetAllUsersWithCards({})

  if (getAllUsersIsLoading || getAllUsersIsError) {
    return null
  }

  return (
    <>
      <NextSeo title="Community" />
      <div className="m-2">
        <h1 className="text-4xl text-center my-6">Community</h1>
        <CommunityTable tableData={users} />
        {/* <UserGrid gridData={users} /> */}
      </div>
    </>
  )
}

export default Community
