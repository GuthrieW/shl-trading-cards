import cards from '@utils/test-data/cards.json'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetLatestPackCards = {
  latestPackCards: Card[]
  isLoading: boolean
  isError: any
}

const UseGetLatestPackCardsKey = 'use-get-latest-pack-cards'

function queryGetLatestPackCards() {
  return useQuery(UseGetLatestPackCardsKey, async () => {
    const { data } = await axios.get('')
    return data
  })
}

const useGetLatestPackCards = (): UseGetLatestPackCards => {
  const { status, data, error, isFetching } = queryGetLatestPackCards()
  return {
    latestPackCards: cards.data.slice(0, 6),
    // latestPackCards: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetLatestPackCards
