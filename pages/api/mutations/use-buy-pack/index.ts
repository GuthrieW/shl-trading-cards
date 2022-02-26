import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'
import { UseGetUserCardsKey } from '@pages/api/queries/use-get-user-cards'
import { UseGetUserKey } from '@pages/api/queries/use-get-user'

type UseBuyPackRequest = {
  uid: number
  packType: PackKey
}

type UseBuyPack = {
  buyPack: Function
  response: AxiosResponse
  isLoading: boolean
  isError: any
}

const useBuyPack = (): UseBuyPack => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading } = useMutation(
    ({ uid, packType }: UseBuyPackRequest) => {
      return axios({
        method: POST,
        url: `/api/v1/cards/purchase/${packType}/${uid}`,
        data: {},
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(UseGetUserCardsKey)
        queryClient.invalidateQueries(UseGetUserKey)
      },
    }
  )

  return {
    buyPack: mutate,
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useBuyPack
