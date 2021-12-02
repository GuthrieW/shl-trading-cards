import useSWR from 'swr'
import cards from '@utils/test-data/cards.json'

type UseAllCards = {
  cards: Card[]
  isLoading: boolean
  isError: boolean
}

const useAllCards = () => {
  const { data, error } = useSWR(() => ``)

  return {
    cards: cards.data,
    isLoading: !data && !error,
    isError: error,
  }
}

export default useAllCards
