import React from 'react'
import { useGetAllUsers } from '@pages/api/queries/index'
import { DataTable } from '@components/index'
import Router from 'next/router'

const columns = [
  {
    label: 'Username',
    name: 'username',
  },
]

const options = {
  onRowClick: (rowData) => {
    Router.push({
      pathname: 'collection',
      query: { username: rowData[0] },
    })
  },
}

const Community = () => {
  const { users, isLoading, isError } = useGetAllUsers()

  return (
    <DataTable
      title={"View a Member's Collection"}
      data={users}
      columns={columns}
      options={options}
    />
  )
}

export default Community
