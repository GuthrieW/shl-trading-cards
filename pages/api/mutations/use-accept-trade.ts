import { POST } from '@constants/http-methods'
import { UseGetUserTradesKey } from '@pages/api/queries/use-get-user-trades'
import { errorToast, successToast } from '@utils/toasts'
import axios, { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'
import { invalidateQueries } from './invalidate-queries'

type UseAcceptTradeRequest = {
  id: number
}

type UseAcceptTrade = {
  acceptTrade: (UseAcceptTradeRequest) => void
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useAcceptTrade = (): UseAcceptTrade => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    ({ id }: UseAcceptTradeRequest) => {
      return axios({
        method: POST,
        url: `api/v2/trades/accept/${id}`,
      })
    },
    {
      onSuccess: () => {
        invalidateQueries(queryClient, [UseGetUserTradesKey])
        successToast({ successText: 'Trade Accepted' })
      },
      onError: () => {
        errorToast({ errorText: 'Error Declining Trade' })
      },
    }
  )

  return {
    acceptTrade: mutate,
    response: data,
    isSuccess,
    isLoading,
    isError: error,
  }
}

export default useAcceptTrade
