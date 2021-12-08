import useSWR from 'swr'
import cards from '@utils/test-data/cards.json'

type UseUnapprovedCards = {
  unapprovedCards: Card[]
  isLoading: boolean
  isError: boolean
}

const useUnapprovedCards = (): UseUnapprovedCards => {
  const { data, error } = useSWR(() => ``)

  return {
    unapprovedCards: cards.data,
    isLoading: !data && !error,
    isError: error,
  }
}

export default useUnapprovedCards
