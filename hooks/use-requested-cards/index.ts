import cards from '@utils/test-data/cards.json'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseRequestedCards = {
  requestedCards: Card[]
  isLoading: boolean
  isError: any
}

const UseRequestedCardsKey = 'use-requested-cards'

function queryRequestedCards() {
  return useQuery(UseRequestedCardsKey, async () => {
    const { data } = await axios.get('')
    return data
  })
}

const useRequestedCards = (): UseRequestedCards => {
  const { status, data, error, isFetching } = queryRequestedCards()
  return {
    requestedCards: cards.data,
    // requestedCards: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useRequestedCards
