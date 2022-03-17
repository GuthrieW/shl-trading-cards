import CommunityTable from '@components/tables/community-table'
import { useGetAllUsers } from '@pages/api/queries'
import React from 'react'

const Community = () => {
  const { users, isLoading, isError } = useGetAllUsers({})

  if (isLoading || isError) return null

  return (
    <div className="m-2">
      <h1>Community</h1>
      <CommunityTable tableData={users} />
    </div>
  )
}

export default Community
