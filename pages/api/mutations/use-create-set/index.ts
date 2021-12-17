import { useMutation, useQueryClient } from 'react-query'
import { POST } from '@constants/http-methods'
import axios, { AxiosResponse } from 'axios'

type UseCreateSetRequest = {
  name: string
  description: string
}

type UseCreateSet = {
  createSet: Function
  response: AxiosResponse
  isLoading: boolean
  isError: any
}

const useCreateSet = (): UseCreateSet => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading } = useMutation(
    ({ name, description }: UseCreateSetRequest) => {
      return axios({
        method: POST,
        url: `/api/v1/sets`,
        data: {
          name: name,
          description: description,
        },
      })
    },
    {
      onSuccess: () => {},
    }
  )

  return {
    createSet: mutate,
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useCreateSet
