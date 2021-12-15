import { GET } from '@constants/http-methods'
import cards from '@utils/test-data/cards.json'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetApprovedCardsRequrest = {}

type UseGetApprovedCards = {
  allCards: Card[]
  isLoading: boolean
  isError: any
}

const UseGetApprovedCardsKey = 'use-get-approved-cards'

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
      allCards: data?.data || [],
      isLoading: isFetching,
      isError: error,
    }
  }

export default useGetApprovedCards
