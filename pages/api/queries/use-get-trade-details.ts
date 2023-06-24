import { useQuery } from 'react-query'
import axios from 'axios'
import { GET } from '@constants/http-methods'

type UseGetTradeDetailsRequest = {
  id: number
}

type UseGetTradeDetails = {
  tradeDetails: TradeDetails[]
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const UseGetTradeDetailsKey = 'use-get-trade-details'

const useGetTradeDetails = ({
  id,
}: UseGetTradeDetailsRequest): UseGetTradeDetails => {
  const { data, error, isFetching, isSuccess } = useQuery(
    `${UseGetTradeDetailsKey}/${id}`,
    async () => {
      return await axios({
        method: GET,
        url: `/api/v2/trades/${id}`,
      })
    }
  )

  return {
    tradeDetails: Array.isArray(data?.data[0]) ? data.data[0] : [],
    isSuccess,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetTradeDetails
