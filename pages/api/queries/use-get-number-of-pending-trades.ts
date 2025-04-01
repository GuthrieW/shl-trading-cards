import { useQuery } from 'react-query'
import axios from 'axios'
import { GET } from '@constants/http-methods'

type UseGetNumberOfPendingTradesRequest = {
  uid: number
}

type UseGetNumberOfPendingTrades = {
  numberOfPendingTrades: number
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const UseGetNumberOfPendingTradesKey = 'use-get-number-of-pending-trades'

const useGetNumberOfPendingTrades = ({
  uid,
}: UseGetNumberOfPendingTradesRequest): UseGetNumberOfPendingTrades => {
  const { data, error, isFetching, isSuccess } = useQuery(
    `${UseGetNumberOfPendingTradesKey}/${uid}`,
    async () => {
      return await axios({
        method: GET,
        url: `/api/v2/trades/pending/${uid}`,
      })
    }
  )

  return {
    numberOfPendingTrades: data?.data?.pending || 0,
    isSuccess,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetNumberOfPendingTrades
