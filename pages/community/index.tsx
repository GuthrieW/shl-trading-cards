import ButtonGroup from '@components/buttons/button-group'
import CommunityTable from '@components/tables/community-table'
import { useGetAllUsers } from '@pages/api/queries'
import React from 'react'

const Community = () => {
  const { users, isLoading, isError } = useGetAllUsers({})

  if (isLoading || isError) return null

  return (
    <div className="m-2">
      <h1>Community</h1>
      {/* <div>
        This should allow people to choose between finding a user and find who owns a card (and how many of that card)
        <ButtonGroup buttons={} selectedButtonId={} />
      </div> */}
      <CommunityTable tableData={users} />
    </div>
  )
}

export default Community
