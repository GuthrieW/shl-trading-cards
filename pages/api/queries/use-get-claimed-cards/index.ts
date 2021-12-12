import cards from '@utils/test-data/cards.json'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetClaimedCards = {
  claimedCards: Card[]
  isLoading: boolean
  isError: any
}

const UseGetClaimedCardsKey = 'use-get-claimed-cards'

function queryGetClaimedCards() {
  return useQuery(UseGetClaimedCardsKey, async () => {
    const { data } = await axios.get('')
    return data
  })
}

const useGetClaimedCards = (): UseGetClaimedCards => {
  const { data, error, isFetching } = queryGetClaimedCards()

  return {
    claimedCards: cards.data,
    // claimedCards: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetClaimedCards
