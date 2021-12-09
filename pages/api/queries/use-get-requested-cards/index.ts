import cards from '@utils/test-data/cards.json'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetRequestedCards = {
  requestedCards: Card[]
  isLoading: boolean
  isError: any
}

const UseGetRequestedCardsKey = 'use-get-requested-cards'

function queryGetRequestedCards() {
  return useQuery(UseGetRequestedCardsKey, async () => {
    const { data } = await axios.get('')
    return data
  })
}

const useGetRequestedCards = (): UseGetRequestedCards => {
  const { status, data, error, isFetching } = queryGetRequestedCards()
  return {
    requestedCards: cards.data,
    // requestedCards: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetRequestedCards
