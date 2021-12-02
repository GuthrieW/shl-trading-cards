import useSWR from 'swr'
import users from '@utils/test-data/user.json'

type UseAllUsers = {
  users: User[]
  isLoading: boolean
  isError: boolean
}

const useAllUsers = (): UseAllUsers => {
  const { data, error } = useSWR(() => ``)

  return {
    users: users.data,
    isLoading: !data && !error,
    isError: error,
  }
}

export default useAllUsers
