import useSWR from 'swr'
import cards from '@utils/test-data/cards.json'

type UseClaimedCards = {
  claimedCards: any[]
  isLoading: boolean
  isError: boolean
}

const useClaimedCards = (): UseClaimedCards => {
  const { data, error } = useSWR(() => ``)

  return {
    claimedCards: cards.data,
    isLoading: false,
    isError: false,
    // isLoading: !data && !error,
    // isError: error,
  }
}

export default useClaimedCards
