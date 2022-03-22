import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { PATCH } from '@constants/http-methods'
import { UseGetApprovedCardsKey } from '@pages/api/queries/use-get-approved-cards'

type UseEditCardRequest = {
  card: Card
}

type UseEditCard = {
  editCard: Function
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useEditCard = (): UseEditCard => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    ({ card }: UseEditCardRequest) => {
      return axios({
        method: PATCH,
        url: `/api/v2/cards/${card.cardID}/edit`,
        data: { card },
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(UseGetApprovedCardsKey)
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
