import { useQuery } from 'react-query'
import axios from 'axios'
import { GET } from '@constants/http-methods'

type UseGetUserCardsRequest = {
  uid: number
}

type UseGetUserCards = {
  userCards: CollectionCard[]
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const UseGetUserCardsKey = 'use-get-user-cards'

const useGetUserCards = ({ uid }: UseGetUserCardsRequest): UseGetUserCards => {
  const { data, error, isFetching, isSuccess } = useQuery(
    UseGetUserCardsKey,
    async () => {
      return await axios({
        method: GET,
        url: `/api/v2/collections/${uid}`,
      })
    }
  )
  return {
    userCards: data?.data || [],
    isSuccess: isSuccess,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetUserCards
