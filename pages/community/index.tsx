import React from 'react'
import { useGetAllUsers } from '@pages/api/queries/index'
import { DataTable } from '@components/index'
import Router from 'next/router'

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

const options = {
  onRowClick: (rowData) => {
    Router.push({
      pathname: 'collection',
      query: { uid: rowData[0] },
    })
  },
  selectableRows: 'none',
}

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
