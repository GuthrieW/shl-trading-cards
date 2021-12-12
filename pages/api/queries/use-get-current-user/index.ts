import user from '@utils/test-data/user.json'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetCurrentUser = {
  currentUser: User
  isLoading: boolean
  isError: any
}

const UseGetCurrentUserKey = 'use-get-current-user'

function queryGetCurrentUser() {
  return useQuery(UseGetCurrentUserKey, async () => {
    const { data } = await axios.get('')
    return data
  })
}

const useGetCurrentUser = (): UseGetCurrentUser => {
  const { data, error, isFetching } = queryGetCurrentUser()

  return {
    currentUser: user.data[0],
    // currentUser: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetCurrentUser
