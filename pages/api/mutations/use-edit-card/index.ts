import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { PATCH } from '@constants/http-methods'
import { UseGetApprovedCardsKey } from '@pages/api/queries/use-get-approved-cards'

type UseEditCardRequest = {
  cardID: number
  newCardData: Card
}

type UseEditCard = {
  editCard: Function
  response: AxiosResponse
  isLoading: boolean
  isError: any
}

const useEditCard = (): UseEditCard => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading } = useMutation(
    ({ cardID, newCardData }: UseEditCardRequest) => {
      return axios({
        method: PATCH,
        url: `/api/v1/cards/${cardID}`,
        data: newCardData,
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
    isLoading: isLoading,
    isError: error,
  }
}

export default useEditCard
