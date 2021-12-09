import { useQuery } from 'react-query'
import cards from '@utils/test-data/cards.json'
import axios from 'axios'

type UseGetUserCards = {
  userCards: Card[]
  isLoading: boolean
  isError: any
}

const UseGetUserCardsKey = 'use-get-user-cards'

function queryGetUserCards(username: string) {
  return useQuery(UseGetUserCardsKey, async () => {
    const { data } = await axios.get(`${username}`)
    return data
  })
}

const useGetUserCards = (username: string): UseGetUserCards => {
  const { status, data, error, isFetching } = queryGetUserCards(username)
  return {
    userCards: cards.data,
    // userCards: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetUserCards
