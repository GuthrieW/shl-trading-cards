import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { PATCH } from '@constants/http-methods'
import { UseGetClaimedCardsKey } from '@pages/api/queries/use-get-claimed-cards'
import { UseGetRequestedCardsKey } from '@pages/api/queries/use-get-requested-cards'
import { UseGetAllCardsKey } from '@pages/api/queries/use-get-all-cards'
import { errorToast, successToast } from '@hooks/use-toast'

type UseClaimCardRequest = {
  cardID: number
  uid: number
}

type UseClaimCard = {
  claimCard: Function
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useClaimCard = (): UseClaimCard => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    ({ cardID, uid }: UseClaimCardRequest) => {
      return axios({
        method: PATCH,
        url: `/api/v2/cards/${cardID}/claim/${uid}`,
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(UseGetAllCardsKey)
        queryClient.invalidateQueries(UseGetClaimedCardsKey)
        queryClient.invalidateQueries(UseGetRequestedCardsKey)
        successToast({ successText: 'Card Claimed' })
      },
      onError: () => {
        errorToast({ errorText: 'Error Claiming Card' })
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
