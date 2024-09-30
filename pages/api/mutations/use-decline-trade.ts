import { POST } from '@constants/http-methods'
import { UseGetUserTradesKey } from '@pages/api/queries/use-get-user-trades'
import axios, { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'
import { invalidateQueries } from './invalidate-queries'
import { UseGetNumberOfPendingTradesKey } from '../queries/use-get-number-of-pending-trades'
import { useToast } from '@chakra-ui/react'
import { errorToastOptions, successToastOptions } from '@utils/toast'

type UseDeclineTradeRequest = {
  id: number
  decliningUid: number
}

type UseDeclineTrade = {
  declineTrade: (UseDeclineTradeRequest) => void
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useDeclineTrade = (): UseDeclineTrade => {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    async ({ id, decliningUid }: UseDeclineTradeRequest) => {
      return await axios({
        method: POST,
        url: `api/v2/trades/decline/${id}/${decliningUid}`,
      })
    },
    {
      onSuccess: () => {
        invalidateQueries(queryClient, [
          UseGetUserTradesKey,
          UseGetNumberOfPendingTradesKey,
        ])
        toast({ title: 'Trade Declined', ...successToastOptions })
      },
      onError: () => {
        toast({ title: 'Error Declining Trade', ...errorToastOptions })
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
