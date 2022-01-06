import { GET } from '@constants/http-methods'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetAllCardsRequrest = {}

type UseGetAllCards = {
  allCards: Card[]
  isLoading: boolean
  isError: any
}

export const UseGetAllCardsKey = 'use-get-all-cards'

const useGetAllCards = ({}: UseGetAllCardsRequrest): UseGetAllCards => {
  const { data, error, isFetching } = useQuery(UseGetAllCardsKey, async () => {
    return await axios({
      method: GET,
      url: '/api/v1/cards/all',
    })
  })

  return {
    allCards: data?.data || [],
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetAllCards
