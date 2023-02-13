import { GET } from '@constants/http-methods'
import axios from 'axios'
import { Card } from 'index.d'
import { useQuery } from 'react-query'

type UseGetRequestedCardsRequest = {}

type UseGetRequestedCards = {
  requestedCards: Card[]
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const UseGetRequestedCardsKey = 'use-get-requested-cards'

const useGetRequestedCards =
  ({}: UseGetRequestedCardsRequest): UseGetRequestedCards => {
    const { data, error, isFetching, isSuccess } = useQuery(
      UseGetRequestedCardsKey,
      async () => {
        return await axios({
          method: GET,
          url: `/api/v2/cards/requested`,
        })
      }
    )
    return {
      requestedCards: data?.data || [],
      isSuccess: isSuccess,
      isLoading: isFetching,
      isError: error,
    }
  }

export default useGetRequestedCards
