import { useQuery } from 'react-query'
import axios from 'axios'
import { POST } from '@constants/http-methods'

type GetAllUsersWithCardsRequest = {
  name: string
  page: number
}

type UseGetAllUsersWithCards = {
  users: User[]
  maxPages: number
  isSuccess: boolean
  isLoading: boolean
  isError: any
  refetch: () => void
}

export const UseGetAllUsersWithCardsKey = 'use-get-all-users-with-cards'

const useGetAllUsersWithCards = ({
  name,
  page,
}: GetAllUsersWithCardsRequest): UseGetAllUsersWithCards => {
  const { data, error, isFetching, isSuccess, refetch } = useQuery(
    UseGetAllUsersWithCardsKey,
    async () => {
      return await axios({
        method: POST,
        url: '/api/v2/users/with-cards',
        data: { name, page },
      })
    }
  )

  return {
    users: data?.data?.users || [],
    maxPages: data?.data?.total || 0,
    isSuccess: isSuccess,
    isLoading: isFetching,
    isError: error,
    refetch,
  }
}

export default useGetAllUsersWithCards
