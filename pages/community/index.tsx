import React from 'react'
import { useGetAllUsers } from '@pages/api/queries/index'
import { DataTable } from '@components/index'
import Router from 'next/router'

const columns = [
  {
    label: 'User ID',
    accessor: 'uid',
  },
  {
    label: 'Username',
    accessor: 'username',
  },
]

const users = [
  {
    uid: '123',
    username: 'cal',
  },
]

const options = {
  onRowClick: (rowData) => {
    Router.push({
      pathname: 'collection',
      query: { uid: rowData[0] },
    })
  },
}

const Community = () => {
  // const { users, isLoading, isError } = useGetAllUsers({})

  return (
    <div>
      <DataTable
        title={"View a Member's Collection"}
        data={users}
        columns={columns}
        options={options}
      />
    </div>
  )
}

export default Community
