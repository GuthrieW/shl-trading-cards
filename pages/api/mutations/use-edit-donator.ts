import { POST } from '@constants/http-methods'
import axios, { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'
import { invalidateQueries } from './invalidate-queries'

type UseEditDonatorRequest = {
  uid: number
  subscription: number
}

type UseEditDonator = {
  editDonator: (UseEditDonatorRequest: UseEditDonatorRequest) => void
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useEditDonator = (): UseEditDonator => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    async ({ uid, subscription }: UseEditDonatorRequest) => {
      return await axios({
        method: POST,
        url: `/api/v2/donations`,
        data: { uid, subscription },
      })
    },
    {
      onSuccess: () => {
        invalidateQueries(queryClient, [])
      },
      onError: () => {},
    }
  )

  return {
    editDonator: mutate,
    response: data,
    isSuccess,
    isLoading,
    isError: error,
  }
}

export default useEditDonator
