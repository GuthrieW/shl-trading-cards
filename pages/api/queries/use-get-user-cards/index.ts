import { useQuery } from 'react-query'
import cards from '@utils/test-data/cards.json'
import axios from 'axios'
import { GET } from '@constants/http-methods'

type UseGetUserCardsRequest = {
  uid: number
}

type UseGetUserCards = {
  userCards: Card[]
  isLoading: boolean
  isError: any
}

const UseGetUserCardsKey = 'use-get-user-cards'

function queryGetUserCards({ uid }: UseGetUserCardsRequest) {
  return useQuery(UseGetUserCardsKey, async () => {
    const { data } = await axios({
      method: GET,
      url: `/api/v1/collections/${uid}`,
    })
    return data
  })
}

const useGetUserCards = ({ uid }: UseGetUserCardsRequest): UseGetUserCards => {
  const { data, error, isFetching } = queryGetUserCards({ uid })
  return {
    userCards: data || [],
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetUserCards
