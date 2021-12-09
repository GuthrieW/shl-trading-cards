import { useQuery } from 'react-query'
import users from '@utils/test-data/user.json'
import axios from 'axios'

type UseAllUsers = {
  users: User[]
  isLoading: boolean
  isError: any
}

const UseAllUsersKey = 'use-all-users'

function queryAllUsers() {
  return useQuery(UseAllUsersKey, async () => {
    const { data } = await axios.get('')
    return data
  })
}

const useAllUsers = (): UseAllUsers => {
  const { status, data, error, isFetching } = queryAllUsers()

  return {
    users: users.data,
    // users: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useAllUsers
