import { GET } from '@constants/http-methods'
import axios from 'axios'
import { Card } from 'index.d'
import { useQuery } from 'react-query'

type UseGetUnapprovedCardsRequest = {}

type UseGetUnapprovedCards = {
  unapprovedCards: Card[]
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const UseGetUnapprovedCardsKey = 'use-get-unapproved-cards'

const useGetUnapprovedCards =
  ({}: UseGetUnapprovedCardsRequest): UseGetUnapprovedCards => {
    const { data, error, isFetching, isSuccess } = useQuery(
      UseGetUnapprovedCardsKey,
      async () => {
        return await axios({ method: GET, url: '/api/v2/cards/unapproved' })
      }
    )

    return {
      unapprovedCards: data?.data || [],
      isSuccess: isSuccess,
      isLoading: isFetching,
      isError: error,
    }
  }

export default useGetUnapprovedCards
