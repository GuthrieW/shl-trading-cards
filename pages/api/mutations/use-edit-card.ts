import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { PATCH } from '@constants/http-methods'
import { UseGetApprovedCardsKey } from '@pages/api/queries/use-get-approved-cards'
import { UseGetAllCardsKey } from '@pages/api/queries/use-get-all-cards'
import { errorToast, successToast } from '@utils/toasts'
import { invalidateQueries } from './invalidate-queries'

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
        successToast({ successText: 'Edited Card' })
      },
      onError: () => {
        errorToast({ errorText: 'Error Editing Card' })
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
