import { GET } from '@constants/http-methods'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetApprovedCardsRequrest = {}

type UseGetApprovedCards = {
  approvedCards: Card[]
  isLoading: boolean
  isError: any
}

export const UseGetApprovedCardsKey = 'use-get-approved-cards'

const useGetApprovedCards =
  ({}: UseGetApprovedCardsRequrest): UseGetApprovedCards => {
    const { data, error, isFetching } = useQuery(
      UseGetApprovedCardsKey,
      async () => {
        return await axios({
          method: GET,
          url: '/api/v1/cards/approved',
        })
      }
    )

    return {
      approvedCards: data?.data || [],
      isLoading: isFetching,
      isError: error,
    }
  }

export default useGetApprovedCards
