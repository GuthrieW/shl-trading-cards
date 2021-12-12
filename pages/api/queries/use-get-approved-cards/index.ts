import cards from '@utils/test-data/cards.json'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetAllCards = {
  allCards: Card[]
  isLoading: boolean
  isError: any
}

const UseGetApprovedCardsKey = 'use-get-approved-cards'

function queryGetApprovedCards() {
  return useQuery(UseGetApprovedCardsKey, async () => {
    const { data } = await axios.get('')
    return data
  })
}

const useGetApprovedCards = (): UseGetAllCards => {
  const { data, error, isFetching } = queryGetApprovedCards()

  return {
    allCards: cards.data,
    // allCards: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetApprovedCards
