import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { PATCH } from '@constants/http-methods'
import { UseGetClaimedCardsKey } from '@pages/api/queries/use-get-claimed-cards'
import { UseGetRequestedCardsKey } from '@pages/api/queries/use-get-requested-cards'

type UseClaimCardRequest = {
  cardID: number
  uid: number
}

type UseClaimCard = {
  claimCard: Function
  response: AxiosResponse
  isLoading: boolean
  isError: any
}

const useClaimCard = (): UseClaimCard => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading } = useMutation(
    ({ cardID, uid }: UseClaimCardRequest) => {
      return axios({
        method: PATCH,
        url: `/api/v2/cards/${cardID}/claim/${uid}`,
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(UseGetClaimedCardsKey)
        queryClient.invalidateQueries(UseGetRequestedCardsKey)
      },
    }
  )

  return {
    claimCard: mutate,
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useClaimCard
