import useSWR from 'swr'
import cards from '@utils/test-data/cards.json'

type UseRequestedCards = {
  requestedCards: Card[]
  isLoading: boolean
  isError: boolean
}

const useRequestedCards = (): UseRequestedCards => {
  const { data, error } = useSWR(() => ``)

  return {
    requestedCards: cards.data,
    isLoading: !data && !error,
    isError: error,
  }
}

export default useRequestedCards
