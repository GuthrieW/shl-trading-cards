import { POST } from '@constants/http-methods'
import { UseGetUserTradesKey } from '@pages/api/queries/use-get-user-trades'
import { errorToast, successToast } from '@utils/toasts'
import axios, { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

type UseDeclineTradeRequest = {
  id: number
}

type UseDeclineTrade = {
  declineTrade: (UseDeclineTradeRequest) => void
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useDeclineTrade = (): UseDeclineTrade => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    async ({ id }: UseDeclineTradeRequest) => {
      return await axios({
        method: POST,
        url: `api/v2/trades/decline/${id}`,
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(UseGetUserTradesKey)
        successToast({ successText: 'Trade Declined' })
      },
      onError: () => {
        errorToast({ errorText: 'Error Declining Trade' })
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
