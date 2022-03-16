import { GET } from '@constants/http-methods'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetUnapprovedCardsRequest = {}

type UseGetUnapprovedCards = {
  unapprovedCards: Card[]
  isLoading: boolean
  isError: any
}

export const UseGetUnapprovedCardsKey = 'use-get-unapproved-cards'

const useGetUnapprovedCards =
  ({}: UseGetUnapprovedCardsRequest): UseGetUnapprovedCards => {
    const { data, error, isFetching } = useQuery(
      UseGetUnapprovedCardsKey,
      async () => {
        return await axios({ method: GET, url: '/api/v1/cards/unapproved' })
      }
    )

    return {
      unapprovedCards: data?.data || [],
      isLoading: isFetching,
      isError: error,
    }
  }

export default useGetUnapprovedCards
