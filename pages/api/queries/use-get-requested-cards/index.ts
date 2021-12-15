import { GET } from '@constants/http-methods'
import cards from '@utils/test-data/cards.json'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetRequestedCardsRequest = {}

type UseGetRequestedCards = {
  requestedCards: Card[]
  isLoading: boolean
  isError: any
}

const UseGetRequestedCardsKey = 'use-get-requested-cards'

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
