import { POST } from '@constants/http-methods'
import { errorToast, successToast } from '@utils/toasts'
import axios, { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

type UseDeclineTradeRequest = {
  tradeID: number
}

type UseDeclineTrade = {
  declineTrade: Function
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useDeclineTrade = (): UseDeclineTrade => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    ({ tradeID }: UseDeclineTradeRequest) => {
      return axios({
        method: POST,
        url: `api/v2/trades/decline/${tradeID}`,
      })
    },
    {
      onSuccess: () => {
        successToast({ successText: 'Trade Declined' })
      },
      onError: () => {
        errorToast({ errorText: 'Error Accepting Trade' })
      },
    }
  )

  return {
    declineTrade: mutate,
    response: data,
    isSuccess,
    isLoading,
    isError: error,
  }
}

export default useDeclineTrade
