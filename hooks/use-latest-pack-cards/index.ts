import useSWR from 'swr'
import cards from '@utils/test-data/cards.json'

type UseLatestPackCards = {
  latestPackCards: Card[]
  isLoading: boolean
  isError: boolean
}

const useLatestPackCards = (): UseLatestPackCards => {
  const { data, error } = useSWR(() => ``)

  return {
    latestPackCards: cards.data.slice(0, 6),
    isLoading: !data && !error,
    isError: error,
  }
}

export default useLatestPackCards
