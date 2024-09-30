import { PATCH } from '@constants/http-methods'
import axios, { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'
import { invalidateQueries } from './invalidate-queries'
import { UseGetAllCardsKey } from '../queries/use-get-all-cards'
import { toastService } from 'services/toastService'

type UseSendToAwaitingClaimRequest = {
  cardID: number
}

type UseSendToAwaitingClaim = {
  sendToAwaitingClaim: (
    UseSendToAwaitingClaimRequest: UseSendToAwaitingClaimRequest
  ) => void
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useSendToAwaitingClaim = (): UseSendToAwaitingClaim => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    async ({ cardID }: UseSendToAwaitingClaimRequest) => {
      return await axios({
        method: PATCH,
        url: `/api/v2/cards/${cardID}/awaitingClaim`,
      })
    },
    {
      onSuccess: () => {
        invalidateQueries(queryClient, [UseGetAllCardsKey])
        toastService.successToast({ title: 'Card Sent to Awaiting Claim' })
      },
      onError: () => {
        toastService.errorToast({
          title: 'Error Sending Card to Awaiting Claim',
        })
      },
    }
  )

  return {
    sendToAwaitingClaim: mutate,
    response: data,
    isSuccess: isSuccess,
    isLoading: isLoading,
    isError: error,
  }
}

export default useSendToAwaitingClaim
