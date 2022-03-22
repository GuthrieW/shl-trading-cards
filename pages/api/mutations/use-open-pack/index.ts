import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'

type UseOpenPackRequest = {
  packID: number
}

type UseOpenPack = {
  openPack: Function
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useOpenPack = (): UseOpenPack => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    ({ packID }: UseOpenPackRequest) => {
      return axios({
        method: POST,
        url: `/api/v2/packs/${packID}`,
        data: {},
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries()
      },
    }
  )

  return {
    openPack: mutate,
    response: data,
    isSuccess: isSuccess,
    isLoading: isLoading,
    isError: error,
  }
}

export default useOpenPack
