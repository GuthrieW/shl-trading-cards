import React, { useEffect, useState } from 'react'
import { useAllUsers } from '@hooks/index'
import { DataTable } from '@components/index'
import Router from 'next/router'

const columns = [
  {
    label: 'Name',
    name: 'username',
  },
  {
    label: 'Number of Cards',
    name: 'cards',
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
  const [userData, setUserData] = useState<any[]>([])

  useEffect(() => {
    const newUserData = users.map((user) => {
      return {
        username: user.username,
        cards: user.cards.length,
      }
    })
    setUserData(newUserData)
  }, [users])

  return (
    <DataTable
      title={"View a Member's Collection"}
      data={userData}
      columns={columns}
      options={options}
    />
  )
}

export default Community
