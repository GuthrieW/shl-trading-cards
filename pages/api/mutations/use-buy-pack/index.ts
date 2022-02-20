import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'
import { UseGetUserCardsKey } from '@pages/api/queries/use-get-user-cards'
import { UseGetUserKey } from '@pages/api/queries/use-get-user'

type UseBuyPackRequest = {
  userId: number
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
    ({ userId, packType }: UseBuyPackRequest) => {
      return axios({
        method: POST,
        url: `localhost:9001/api/v1/purchase/cards?userId=${userId}&packType=${packType}`,
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
