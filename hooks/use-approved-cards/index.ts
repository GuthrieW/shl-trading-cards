import useSWR from 'swr'
import cards from '@utils/test-data/cards.json'

type UseAllCards = {
  allCards: Card[]
  isLoading: boolean
  isError: boolean
}

const useApprovedCards = (): UseAllCards => {
  const { data, error } = useSWR(() => ``)

  return {
    allCards: cards.data,
    isLoading: !data && !error,
    isError: error,
  }
}

export default useApprovedCards
