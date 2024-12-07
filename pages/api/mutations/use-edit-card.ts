import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { PATCH } from '@constants/http-methods'
import { UseGetApprovedCardsKey } from '@pages/api/queries/use-get-approved-cards'
import { UseGetAllCardsKey } from '@pages/api/queries/use-get-all-cards'
import { invalidateQueries } from './invalidate-queries'
import { useToast } from '@chakra-ui/react'
import { errorToastOptions, successToastOptions } from '@utils/toast'

type UseEditCardRequest = {
  card: Card
}

type UseEditCard = {
  editCard: (UseEditCardRequest) => void
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useEditCard = (): UseEditCard => {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    async ({ card }: UseEditCardRequest) => {
      return await axios({
        method: PATCH,
        url: `/api/v2/cards/${card.cardID}/edit`,
        data: { card },
      })
    },
    {
      onSuccess: () => {
        invalidateQueries(queryClient, [
          UseGetAllCardsKey,
          UseGetApprovedCardsKey,
        ])
        toast({ title: 'Edited Card', ...successToastOptions })
      },
      onError: () => {
        toast({ title: 'Error Editing Card', ...errorToastOptions })
      },
    }
  )

  return {
    editCard: mutate,
    response: data,
    isSuccess: isSuccess,
    isLoading: isLoading,
    isError: error,
  }
}

export default useEditCard
