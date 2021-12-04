import React, { useEffect, useState } from 'react'
import { useAllUsers } from '@hooks/index'
import { DataTable } from '@components/index'

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
      title={'Community'}
      data={userData}
      columns={columns}
      options={{}}
    />
  )
}

export default Community
