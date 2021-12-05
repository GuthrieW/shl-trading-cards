import useSWR from 'swr'
import users from '@utils/test-data/user.json'

type UseCardOwners = {
  cardOwners: User[]
  isLoading: boolean
  isError: boolean
}

const useCardOwners = (): UseCardOwners => {
  const { data, error } = useSWR(() => ``)

  return {
    cardOwners: users.data,
    isLoading: !data && !error,
    isError: error,
  }
}

export default useCardOwners
