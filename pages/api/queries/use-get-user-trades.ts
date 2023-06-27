import { useQuery } from 'react-query'
import axios from 'axios'
import { GET } from '@constants/http-methods'

type UseGetUserTradesRequest = {
  uid: number
}

type UseGetUserTrades = {
  userTrades: Trade[]
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const UseGetUserTradesKey = 'use-get-user-trades'

const useGetUserTrades = ({
  uid,
}: UseGetUserTradesRequest): UseGetUserTrades => {
  const { data, error, isFetching, isSuccess } = useQuery(
    UseGetUserTradesKey,
    async () => {
      return await axios({
        method: GET,
        url: `/api/v2/trades/user/${uid}`,
      })
    }
  )

  const trades = Array.isArray(data?.data[0]) ? data.data[0] : []

  return {
    userTrades: trades,
    isSuccess,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetUserTrades
