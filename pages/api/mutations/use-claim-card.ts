import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { PATCH } from '@constants/http-methods'
import { UseGetClaimedCardsKey } from '@pages/api/queries/use-get-claimed-cards'
import { UseGetRequestedCardsKey } from '@pages/api/queries/use-get-requested-cards'
import { UseGetAllCardsKey } from '@pages/api/queries/use-get-all-cards'
import { errorToast, successToast } from '@utils/toasts'
import { invalidateQueries } from './invalidate-queries'

type UseClaimCardRequest = {
  cardID: number
  uid: number
}

type UseClaimCard = {
  claimCard: (UseClaimCardRequest) => void
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useClaimCard = (): UseClaimCard => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    async ({ cardID, uid }: UseClaimCardRequest) => {
      return await axios({
        method: PATCH,
        url: `/api/v2/cards/${cardID}/claim/${uid}`,
      })
    },
    {
      onSuccess: () => {
        invalidateQueries(queryClient, [
          UseGetAllCardsKey,
          UseGetClaimedCardsKey,
          UseGetRequestedCardsKey,
        ])
        successToast({ title: 'Card Claimed' })
      },
      onError: () => {
        errorToast({ title: 'Error Claiming Card' })
      },
    }
  )

  return {
    claimCard: mutate,
    response: data,
    isSuccess: isSuccess,
    isLoading: isLoading,
    isError: error,
  }
}

export default useClaimCard
