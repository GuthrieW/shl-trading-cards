import React, { useEffect, useState } from 'react'
import { useAllUsers } from '@hooks/index'
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
    console.log('rowData', rowData)
    Router.push({
      pathname: 'collection',
      query: { username: rowData[0] },
    })
  },
}

const Community = () => {
  const { users, isLoading, isError } = useAllUsers()

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
