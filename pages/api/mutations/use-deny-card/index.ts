import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { PATCH } from '@constants/http-methods'
import { UseGetRequestedCardsKey } from '@pages/api/queries/use-get-requested-cards'
import { UseGetUnapprovedCardsKey } from '@pages/api/queries/use-get-unapproved-cards'

type UseDenyCardRequest = {
  cardID: number
}

type UseDenyCard = {
  denyCard: Function
  response: AxiosResponse
  isLoading: boolean
  isError: any
}

const useDenyCard = (): UseDenyCard => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading } = useMutation(
    ({ cardID }: UseDenyCardRequest) => {
      return axios({
        method: PATCH,
        url: `/api/v2/cards/${cardID}/deny`,
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(UseGetRequestedCardsKey)
        queryClient.invalidateQueries(UseGetUnapprovedCardsKey)
      },
    }
  )

  return {
    denyCard: mutate,
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useDenyCard
