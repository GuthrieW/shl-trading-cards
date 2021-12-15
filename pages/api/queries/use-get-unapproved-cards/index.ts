import { GET } from '@constants/http-methods'
import cards from '@utils/test-data/cards.json'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetUnapprovedCardsRequest = {}

type UseGetUnapprovedCards = {
  unapprovedCards: Card[]
  isLoading: boolean
  isError: any
}

const UseGetUnapprovedCardsKey = 'use-get-unapproved-cards'

function queryGetUnapprovedCards({}: UseGetUnapprovedCardsRequest) {
  return useQuery(UseGetUnapprovedCardsKey, async () => {
    const { data } = await axios({
      method: GET,
      url: '/api/v1/cards/unapproved',
    })
    return data
  })
}

const useGetUnapprovedCards =
  ({}: UseGetUnapprovedCardsRequest): UseGetUnapprovedCards => {
    const { data, error, isFetching } = queryGetUnapprovedCards({})

    return {
      unapprovedCards: data || [],
      isLoading: isFetching,
      isError: error,
    }
  }

export default useGetUnapprovedCards
