import cards from '@utils/test-data/cards.json'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetUnapprovedCards = {
  unapprovedCards: Card[]
  isLoading: boolean
  isError: any
}

const UseGetUnapprovedCardsKey = 'use-get-unapproved-cards'

function queryGetUnapprovedCards() {
  return useQuery(UseGetUnapprovedCardsKey, async () => {
    const { data } = await axios.get('')
    return data
  })
}

const useGetUnapprovedCards = (): UseGetUnapprovedCards => {
  const { data, error, isFetching } = queryGetUnapprovedCards()

  return {
    unapprovedCards: cards.data,
    // unapprovedCards: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetUnapprovedCards
