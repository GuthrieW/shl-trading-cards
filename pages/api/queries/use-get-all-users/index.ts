import { useQuery } from 'react-query'
import users from '@utils/test-data/user.json'
import axios from 'axios'

type UseGetAllUsers = {
  users: User[]
  isLoading: boolean
  isError: any
}

const UseGetAllUsersKey = 'use-get-all-users'

function queryGetAllUsers() {
  return useQuery(UseGetAllUsersKey, async () => {
    const { data } = await axios.get('')
    return data
  })
}

const useGetAllUsers = (): UseGetAllUsers => {
  const { status, data, error, isFetching } = queryGetAllUsers()

  return {
    users: users.data,
    // users: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetAllUsers
