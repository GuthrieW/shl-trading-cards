import ButtonGroup from '@components/buttons/button-group'
import CommunityTable from '@components/tables/community-table'
import { useGetAllUsersWithCards } from '@pages/api/queries'
import { NextSeo } from 'next-seo'
import React from 'react'

const Community = () => {
  const {
    users,
    isSuccess: getAllUsersIsSuccess,
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
        {/* <div>
        This should allow people to choose between finding a user and find who owns a card (and how many of that card)
        <ButtonGroup buttons={} selectedButtonId={} />
      </div> */}
        <CommunityTable tableData={users} />
      </div>
    </>
  )
}

export default Community
