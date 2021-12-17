import { useMutation, useQueryClient } from 'react-query'
import { DELETE } from '@constants/http-methods'
import axios, { AxiosResponse } from 'axios'

type UseDeleteSetRequest = {
  setID: number
}

type UseDeleteSet = {
  deleteSet: Function
  response: AxiosResponse
  isLoading: boolean
  isError: any
}

const useDeleteSet = (): UseDeleteSet => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading } = useMutation(
    ({ setID }: UseDeleteSetRequest) => {
      return axios({
        method: DELETE,
        url: `/api/v1/sets/${setID}`,
      })
    },
    {
      onSuccess: () => {},
    }
  )

  return {
    deleteSet: mutate,
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useDeleteSet
