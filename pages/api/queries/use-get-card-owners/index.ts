import users from '@utils/test-data/user.json'
import { useQuery } from 'react-query'
import axios from 'axios'

type UseGetCardOwners = {
  cardOwners: User[]
  isLoading: boolean
  isError: any
}

const UseGetCardOwnersKey = 'use-get-card-owners'

function queryGetCardOwners() {
  return useQuery(UseGetCardOwnersKey, async () => {
    const { data } = await axios.get('')
    return data
  })
}

const useGetCardOwners = (): UseGetCardOwners => {
  const { status, data, error, isFetching } = queryGetCardOwners()

  return {
    cardOwners: users.data,
    // cardOwners: data,
    isLoading: !data && !error,
    isError: error,
  }
}

export default useGetCardOwners
