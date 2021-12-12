import users from '@utils/test-data/user.json'
import { useQuery } from 'react-query'
import axios from 'axios'
import { GET } from '@constants/http-methods'

type UseGetCardOwnersRequest = {
  cardID: number
}

type UseGetCardOwners = {
  cardOwners: User[]
  isLoading: boolean
  isError: any
}

const UseGetCardOwnersKey = 'use-get-card-owners'

function queryGetCardOwners({ cardID }: UseGetCardOwnersRequest) {
  return useQuery(UseGetCardOwnersKey, async () => {
    const { data } = await axios({
      method: GET,
      url: `/api/v1/collections/owners/${cardID}`,
    })
    return data
  })
}

const useGetCardOwners = ({
  cardID,
}: UseGetCardOwnersRequest): UseGetCardOwners => {
  const { data, error, isFetching } = queryGetCardOwners({ cardID })

  return {
    cardOwners: users.data,
    // cardOwners: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetCardOwners
