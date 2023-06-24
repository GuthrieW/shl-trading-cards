import { useQuery } from 'react-query'
import axios from 'axios'
import { GET } from '@constants/http-methods'

type UseGetUserCardsForTradesRequest = {
  uid: number
}

type UseGetUserCardsForTrades = {
  userCardsForTrades: TradeCard[]
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const UseGetUserCardsForTradesKey = 'use-get-user-cards-for-trades'

const useGetUserCardsForTrades = ({
  uid,
}: UseGetUserCardsForTradesRequest): UseGetUserCardsForTrades => {
  const { data, error, isFetching, isSuccess } = useQuery(
    `${UseGetUserCardsForTradesKey}/${uid}`,
    async () => {
      return await axios({
        method: GET,
        url: `/api/v2/collections/trade/${uid}`,
      })
    }
  )

  console.log('data', data)

  return {
    userCardsForTrades: data?.data || [],
    isSuccess: isSuccess,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetUserCardsForTrades
