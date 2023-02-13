import { GET } from '@constants/http-methods'
import axios from 'axios'
import { Card } from 'index.d'
import { useQuery } from 'react-query'

type UseGetApprovedCardsRequrest = {}

type UseGetApprovedCards = {
  approvedCards: Card[]
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const UseGetApprovedCardsKey = 'use-get-approved-cards'

const useGetApprovedCards =
  ({}: UseGetApprovedCardsRequrest): UseGetApprovedCards => {
    const { data, error, isFetching, isSuccess } = useQuery(
      UseGetApprovedCardsKey,
      async () => {
        return await axios({
          method: GET,
          url: '/api/v2/cards/approved',
        })
      }
    )

    return {
      approvedCards: data?.data || [],
      isSuccess: isSuccess,
      isLoading: isFetching,
      isError: error,
    }
  }

export default useGetApprovedCards
