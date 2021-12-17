import { useMutation, useQueryClient } from 'react-query'
import { PATCH } from '@constants/http-methods'
import axios, { AxiosResponse } from 'axios'

type UseUpdateSetRequest = {
  setID: number
  name: string
  description: string
  cardIdsToAdd: Card[]
  cardIdsToRemove: Card[]
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
    ({ setID, cardIdsToAdd, cardIdsToRemove }: UseUpdateSetRequest) => {
      return axios({
        method: PATCH,
        url: `/api/v1/sets/${setID}/`,
        data: {
          cardIdsToAdd,
          cardIdsToRemove,
        },
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
