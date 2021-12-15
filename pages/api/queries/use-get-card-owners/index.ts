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

const useGetCardOwners = ({
  cardID,
}: UseGetCardOwnersRequest): UseGetCardOwners => {
  const { data, error, isFetching } = useQuery(
    UseGetCardOwnersKey,
    async () => {
      return await axios({
        method: GET,
        url: `/api/v1/collections/owners/${cardID}`,
      })
    }
  )

  return {
    cardOwners: data?.data || [],
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetCardOwners
