import { POST } from '@constants/http-methods'
import { errorToast } from '@utils/toasts'
import axios, { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'

export type TradeAsset = {
  ownedCardId: string
  toId: string
  fromId: string
}

type UseCreateTradeRequest = {
  initiatorId: string
  recipientId: string
  tradeAssets: TradeAsset[]
}

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
    ({ initiatorId, recipientId, tradeAssets }: UseCreateTradeRequest) => {
      return axios({
        method: POST,
        url: '/api/v2/trades',
        data: {
          initiatorId,
          recipientId,
          tradeAssets,
        },
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
