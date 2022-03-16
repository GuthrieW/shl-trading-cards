import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'

type UseOpenPackRequest = {
  uid: number
  packType: PackKey
}

type UseOpenPack = {
  openPack: Function
  response: AxiosResponse
  isLoading: boolean
  isError: any
}

const useOpenPack = (): UseOpenPack => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading } = useMutation(
    ({ uid, packType }: UseOpenPackRequest) => {
      return axios({
        method: POST,
        url: `/api/v1/cards/open/${packType}/${uid}`,
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
    isLoading: isLoading,
    isError: error,
  }
}

export default useOpenPack
