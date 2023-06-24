import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'
import { UseGetRequestedCardsKey } from '@pages/api/queries/use-get-requested-cards'
import { UseGetAllCardsKey } from '@pages/api/queries/use-get-all-cards'
import { errorToast } from '@utils/toasts'

type UseCreateCardRequest = {
  card: CardRequest
}

type UseCreateCard = {
  createCard: (UseCreateCardRequest) => void
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useCreateCard = (): UseCreateCard => {
  const queryClient = useQueryClient()
  const { mutate, data, isLoading, isError, isSuccess } = useMutation(
    async ({ card }: UseCreateCardRequest) => {
      return await axios({
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
      onError: () => {
        errorToast({ errorText: 'Failed to create card' })
      },
    }
  )

  return {
    createCard: mutate,
    response: data,
    isSuccess,
    isLoading,
    isError,
  }
}

export default useCreateCard
