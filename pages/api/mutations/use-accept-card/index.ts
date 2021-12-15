import { useMutation, useQueryClient } from 'react-query'
import { PATCH } from '@constants/http-methods'
import axios, { AxiosResponse } from 'axios'
import { UseGetApprovedCardsKey } from '@pages/api/queries/use-get-approved-cards'
import { UseGetUnapprovedCardsKey } from '@pages/api/queries/use-get-unapproved-cards'
import { UseGetRequestedCardsKey } from '@pages/api/queries/use-get-requested-cards'

type UseAcceptCardRequest = {
  cardID: number
}

type UseAcceptCard = {
  acceptCard: Function
  response: AxiosResponse
  isLoading: boolean
  isError: any
}

const useAcceptCard = (): UseAcceptCard => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading } = useMutation(
    ({ cardID }: UseAcceptCardRequest) => {
      return axios({
        method: PATCH,
        url: `/api/v1/cards/${cardID}/approve`,
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(UseGetApprovedCardsKey)
        queryClient.invalidateQueries(UseGetUnapprovedCardsKey)
        queryClient.invalidateQueries(UseGetRequestedCardsKey)
      },
    }
  )
  return {
    acceptCard: mutate,
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useAcceptCard
