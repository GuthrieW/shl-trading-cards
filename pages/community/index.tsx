import React from 'react'
import { useGetAllUsers } from '@pages/api/queries/index'
import { DataTable } from '@components/index'

const columns = [
  {
    headerName: 'User ID',
    field: 'uid',
  },
  {
    headerName: 'Username',
    field: 'username',
  },
]

const Community = () => {
  const { users, isLoading, isError } = useGetAllUsers({})

  return (
    <DataTable
      title={"View a Member's Collection"}
      data={users}
      columns={columns}
    />
  )
}

export default Community
