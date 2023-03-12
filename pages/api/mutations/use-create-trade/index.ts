import { POST } from '@constants/http-methods'
import { errorToast } from '@utils/toasts'
import axios, { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

type UseCreateTradeRequest = {}

type UseCreateTrade = {
  createTrade: Function
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useCreateTrade = (): UseCreateTrade => {
  const queryClient = useQueryClient()
  const { mutate, data, isLoading, isError, isSuccess } = useMutation(
    ({}: UseCreateTradeRequest) => {
      return axios({
        method: POST,
        url: '/api/v2/trade',
        data: {},
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries()
      },
      onError: () => {
        errorToast({ errorText: 'Failed to create trade' })
      },
    }
  )

  return {
    createTrade: mutate,
    response: data,
    isSuccess,
    isLoading,
    isError,
  }
}

export default useCreateTrade
