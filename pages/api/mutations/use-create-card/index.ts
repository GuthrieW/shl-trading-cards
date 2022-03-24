import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'
import { UseGetRequestedCardsKey } from '@pages/api/queries/use-get-requested-cards'
import { UseGetAllCardsKey } from '@pages/api/queries/use-get-all-cards'

interface UseCreateCardRequest {
  card: CardRequest
}

type UseCreateCard = {
  createCard: Function
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useCreateCard = (): UseCreateCard => {
  const queryClient = useQueryClient()
  const { mutate, data, isLoading, isError, isSuccess } = useMutation(
    ({ card }: UseCreateCardRequest) => {
      console.log('card', card)
      return axios({
        method: POST,
        url: '/api/v2/cards',
        data: { card },
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(UseGetRequestedCardsKey)
        queryClient.invalidateQueries(UseGetAllCardsKey)
      },
    }
  )

  return {
    createCard: mutate,
    response: data,
    isSuccess: isSuccess,
    isLoading: isLoading,
    isError: isError,
  }
}

export default useCreateCard
