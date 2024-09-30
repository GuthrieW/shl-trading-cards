import { POST } from '@constants/http-methods'
import axios, { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'
import { invalidateQueries } from './invalidate-queries'
import { UseGetUserTradesKey } from '@pages/api/queries/use-get-user-trades'
import { UseGetNumberOfPendingTradesKey } from '../queries/use-get-number-of-pending-trades'
import { useToast } from '@chakra-ui/react'
import { errorToastOptions, successToastOptions } from '@utils/toast'

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
  createTrade: (UseCreateTradeRequest) => void
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useCreateTrade = (): UseCreateTrade => {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { mutate, data, isLoading, isError, isSuccess } = useMutation(
    async ({
      initiatorId,
      recipientId,
      tradeAssets,
    }: UseCreateTradeRequest) => {
      return await axios({
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
        invalidateQueries(queryClient, [
          UseGetUserTradesKey,
          UseGetNumberOfPendingTradesKey,
        ])
        toast({ title: 'Trade created', ...successToastOptions })
      },
      onError: () => {
        toast({ title: 'Failed to create trade', ...errorToastOptions })
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
