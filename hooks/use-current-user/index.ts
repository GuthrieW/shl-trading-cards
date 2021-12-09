import user from '@utils/test-data/user.json'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseCurrentUser = {
  currentUser: User
  isLoading: boolean
  isError: any
}

const UseCurrentUserKey = 'use-current-user'

function queryCurrentUser() {
  return useQuery(UseCurrentUserKey, async () => {
    const { data } = await axios.get('')
    return data
  })
}

const useCurrentUser = (): UseCurrentUser => {
  const { status, data, error, isFetching } = queryCurrentUser()

  return {
    currentUser: user.data[0],
    // currentUser: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useCurrentUser
