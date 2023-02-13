import { GET } from '@constants/http-methods'
import axios from 'axios'
import { Card } from 'index.d'
import { useQuery } from 'react-query'

type UseGetAllCardsRequrest = {}

type UseGetAllCards = {
  allCards: Card[]
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const UseGetAllCardsKey = 'use-get-all-cards'

const useGetAllCards = ({}: UseGetAllCardsRequrest): UseGetAllCards => {
  const { data, error, isFetching, isSuccess } = useQuery(
    UseGetAllCardsKey,
    async () => {
      return await axios({
        method: GET,
        url: '/api/v2/cards',
      })
    }
  )

  return {
    allCards: data?.data || [],
    isSuccess: isSuccess,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetAllCards
