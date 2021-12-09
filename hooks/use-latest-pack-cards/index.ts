import cards from '@utils/test-data/cards.json'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseLatestPackCards = {
  latestPackCards: Card[]
  isLoading: boolean
  isError: any
}

const UseLatestPackCardsKey = 'use-latest-pack-cards'

function queryLatestPackCards() {
  return useQuery(UseLatestPackCardsKey, async () => {
    const { data } = await axios.get('')
    return data
  })
}

const useLatestPackCards = (): UseLatestPackCards => {
  const { status, data, error, isFetching } = queryLatestPackCards()
  return {
    latestPackCards: cards.data.slice(0, 6),
    // latestPackCards: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useLatestPackCards
