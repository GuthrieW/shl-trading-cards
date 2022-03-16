import { GET } from '@constants/http-methods'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetRequestedCardsRequest = {}

type UseGetRequestedCards = {
  requestedCards: Card[]
  isLoading: boolean
  isError: any
}

export const UseGetRequestedCardsKey = 'use-get-requested-cards'

const useGetRequestedCards =
  ({}: UseGetRequestedCardsRequest): UseGetRequestedCards => {
    const { data, error, isFetching } = useQuery(
      UseGetRequestedCardsKey,
      async () => {
        return await axios({
          method: GET,
          url: `/api/v1/cards/requested`,
        })
      }
    )
    return {
      requestedCards: data?.data || [],
      isLoading: isFetching,
      isError: error,
    }
  }

export default useGetRequestedCards
