import { useQuery } from 'react-query'
import cards from '@utils/test-data/cards.json'
import axios from 'axios'

type UseUserCards = {
  userCards: Card[]
  isLoading: boolean
  isError: any
}

const UseUserCardsKey = 'use-user-cards'

function queryUserCards(username: string) {
  return useQuery(UseUserCardsKey, async () => {
    const { data } = await axios.get(`${username}`)
    return data
  })
}

const useUserCards = (username: string): UseUserCards => {
  const { status, data, error, isFetching } = queryUserCards(username)
  return {
    userCards: cards.data,
    // userCards: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useUserCards
