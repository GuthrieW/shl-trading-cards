import { useMutation, useQueryClient } from 'react-query'
import { POST } from '@constants/http-methods'
import axios, { AxiosResponse } from 'axios'

type UseUpdateSetRequest = {
  setID: number
  name: string
  description: string
  cards: Card[]
}

type UseUpdateSet = {
  updateSet: Function
  response: AxiosResponse
  isLoading: boolean
  isError: any
}

const useUpdateSet = (): UseUpdateSet => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading } = useMutation(
    ({ setID, name, description, cards }: UseUpdateSetRequest) => {
      const cardIds = cards.map((card: Card) => {
        return card.cardID
      })
      return axios({
        method: POST,
        url: `/api/v1/card-sets/${setID}`,
        data: { name, description, cardIds },
      })
    },
    {
      onSuccess: () => {},
    }
  )

  return {
    updateSet: mutate,
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useUpdateSet
