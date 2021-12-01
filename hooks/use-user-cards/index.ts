import useSWR from 'swr'
import cards from '@utils/test-data/cards.json'

const useUserCards = (username: string) => {
  const { data, error } = useSWR(() => ``)

  return {
    cards: cards.data,
    isLoading: !data && !error,
    isError: error,
  }
}

export default useUserCards
