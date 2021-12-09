import cards from '@utils/test-data/cards.json'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseClaimedCards = {
  claimedCards: Card[]
  isLoading: boolean
  isError: any
}

const UseClaimedCardsKey = 'use-claimed-cards'

function queryClaimedCards() {
  return useQuery(UseClaimedCardsKey, async () => {
    const { data } = await axios.get('')
    return data
  })
}

const useClaimedCards = (): UseClaimedCards => {
  const { status, data, error, isFetching } = queryClaimedCards()

  return {
    claimedCards: cards.data,
    // claimedCards: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useClaimedCards
