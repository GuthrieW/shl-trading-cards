import users from '@utils/test-data/user.json'
import { useQuery } from 'react-query'
import axios from 'axios'

type UseCardOwners = {
  cardOwners: User[]
  isLoading: boolean
  isError: any
}

const UseCardOwnersKey = 'use-card-owners'

function queryCardOwners() {
  return useQuery(UseCardOwnersKey, async () => {
    const { data } = await axios.get('')
    return data
  })
}

const useCardOwners = (): UseCardOwners => {
  const { status, data, error, isFetching } = queryCardOwners()

  return {
    cardOwners: users.data,
    // cardOwners: data,
    isLoading: !data && !error,
    isError: error,
  }
}

export default useCardOwners
