import { useQuery } from 'react-query'
import axios from 'axios'
import { GET } from '@constants/http-methods'
import { User } from 'index.d'

type GetAllUsersWithCardsRequest = {}

type UseGetAllUsersWithCards = {
  users: User[]
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const UseGetAllUsersWithCardsKey = 'use-get-all-users-with-cards'

const useGetAllUsersWithCards =
  ({}: GetAllUsersWithCardsRequest): UseGetAllUsersWithCards => {
    const { data, error, isFetching, isSuccess } = useQuery(
      UseGetAllUsersWithCardsKey,
      async () => {
        return await axios({
          method: GET,
          url: '/api/v2/users/with-cards',
        })
      }
    )

    return {
      users: data?.data || [],
      isSuccess: isSuccess,
      isLoading: isFetching,
      isError: error,
    }
  }

export default useGetAllUsersWithCards
