import { useQuery } from 'react-query'
import axios from 'axios'
import { POST } from '@constants/http-methods'

type UseGetUserCardsRequest = {
  uid: number
  name: string
  teams: string[]
  rarities: string[]
  page: number
}

type UseGetUserCards = {
  userCards: CollectionCard[]
  maxPages: number
  isSuccess: boolean
  isLoading: boolean
  isError: any
  refetch: () => void
}

export const UseGetUserCardsKey = 'use-get-user-cards'

const useGetUserCards = ({
  uid,
  name = '',
  teams = [],
  rarities = [],
  page = 0,
}: UseGetUserCardsRequest): UseGetUserCards => {
  const { data, error, isFetching, isSuccess, refetch } = useQuery(
    `${UseGetUserCardsKey}/${uid}`,
    async () => {
      return await axios({
        method: POST,
        url: `/api/v2/collections/${uid}`,
        data: { name, teams, rarities, page },
      })
    }
  )

  return {
    userCards: data?.data?.cards || [],
    maxPages: data?.data?.total || 0,
    isSuccess: isSuccess,
    isLoading: isFetching,
    isError: error,
    refetch,
  }
}

export default useGetUserCards
