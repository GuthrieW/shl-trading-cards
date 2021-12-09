import cards from '@utils/test-data/cards.json'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseUnapprovedCards = {
  unapprovedCards: Card[]
  isLoading: boolean
  isError: any
}

const UseUnapprovedCardsKey = 'use-unapproved-cards'

function queryUnapprovedCards() {
  return useQuery(UseUnapprovedCardsKey, async () => {
    const { data } = await axios.get('')
    return data
  })
}

const useUnapprovedCards = (): UseUnapprovedCards => {
  const { status, data, error, isFetching } = queryUnapprovedCards()

  return {
    unapprovedCards: cards.data,
    // unapprovedCards: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useUnapprovedCards
