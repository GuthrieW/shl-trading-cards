import { GET } from '@constants/http-methods'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetUsersWithMostCardsRequest = {}

type UseGetUsersWithMostCards = {
  cardOwners: MostCardsOwner[]
  isSuccess: boolean
  isLoading: boolean
  isError: boolean
}

export const UseGetUsersWithMostCardsKey = 'use-get-users-with-most-cards'

const useGetUsersWithMostCards =
  ({}: UseGetUsersWithMostCardsRequest): UseGetUsersWithMostCards => {
    const { data, error, isFetching, isSuccess } = useQuery(
      UseGetUsersWithMostCardsKey,
      async () => {
        return await axios({
          method: GET,
          url: `api/v2/users/most`,
        })
      }
    )
    return {
      cardOwners: data?.data || [],
      isSuccess,
      isLoading: isFetching,
      isError: !!error,
    }
  }

export default useGetUsersWithMostCards
