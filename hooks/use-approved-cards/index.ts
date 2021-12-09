import cards from '@utils/test-data/cards.json'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseAllCards = {
  allCards: Card[]
  isLoading: boolean
  isError: any
}

const UseApprovedCardsKey = 'use-approved-cards'

function queryApprovedCards() {
  return useQuery(UseApprovedCardsKey, async () => {
    const { data } = await axios.get('')
    return data
  })
}

const useApprovedCards = (): UseAllCards => {
  const { status, data, error, isFetching } = queryApprovedCards()

  return {
    allCards: cards.data,
    // allCards: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useApprovedCards
