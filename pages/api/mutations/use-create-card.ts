import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'
import { UseGetRequestedCardsKey } from '@pages/api/queries/use-get-requested-cards'
import { UseGetAllCardsKey } from '@pages/api/queries/use-get-all-cards'
import { invalidateQueries } from './invalidate-queries'
import { useToast } from '@chakra-ui/react'
import { errorToastOptions } from '@utils/toast'

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
  const toast = useToast()
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
        invalidateQueries(queryClient, [
          UseGetRequestedCardsKey,
          UseGetAllCardsKey,
        ])
      },
      onError: () => {
        toast({ title: 'Failed to create card', ...errorToastOptions })
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
