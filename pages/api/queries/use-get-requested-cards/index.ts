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

function queryGetRequestedCards({}: UseGetRequestedCardsRequest) {
  return useQuery(UseGetRequestedCardsKey, async () => {
    const { data } = await axios({
      method: GET,
      url: `/api/v1/cards/requested`,
    })
    return data
  })
}

const useGetRequestedCards =
  ({}: UseGetRequestedCardsRequest): UseGetRequestedCards => {
    const { data, error, isFetching } = queryGetRequestedCards({})
    return {
      requestedCards: cards.data,
      // requestedCards: data,
      isLoading: isFetching,
      isError: error,
    }
  }

export default useGetRequestedCards
