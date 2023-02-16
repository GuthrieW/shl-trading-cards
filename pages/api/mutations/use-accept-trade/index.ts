import { POST } from '@constants/http-methods'
import { errorToast, successToast } from '@utils/toasts'
import axios, { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

type UseAcceptTradeRequest = {
  id: number
}

type UseAcceptTrade = {
  acceptTrade: Function
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
        queryClient.invalidateQueries()
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
