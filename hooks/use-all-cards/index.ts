import useSWR from 'swr'

const useAllCards = () => {
  const { data, error } = useSWR(() => ``)

  return {
    cards: data,
    isLoading: !data && !error,
    isError: error,
  }
}

export default useAllCards
