import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'
import { UseGetRequestedCardsKey } from '@pages/api/queries/use-get-requested-cards'

interface UseCreateCardRequest {
  card: CardRequest
}

type UseCreateCard = {
  createCard: Function
  response: AxiosResponse
  isLoading: boolean
  isError: any
}

const useCreateCard = (): UseCreateCard => {
  const queryClient = useQueryClient()
  const { mutate, data, isLoading, isError } = useMutation(
    ({ card }: UseCreateCardRequest) => {
      return axios({
        method: POST,
        url: '/api/v2/cards',
        data: { card },
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(UseGetRequestedCardsKey)
      },
    }
  )

  return {
    createCard: mutate,
    response: data,
    isLoading: isLoading,
    isError: isError,
  }
}

export default useCreateCard
