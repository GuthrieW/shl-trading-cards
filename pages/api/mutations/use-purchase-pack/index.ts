import { UseMutateFunction, useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'
import { UseGetUserCardsKey } from '@pages/api/queries/use-get-user-cards'

type UsePurchasePackRequest = {
  packType: string
  uid: number
}

type UsePurchasePack = {
  purchasePack: Function
  response: AxiosResponse
  isLoading: boolean
  isError: any
}

const usePurchasePack = (): UsePurchasePack => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading } = useMutation(
    ({ packType, uid }: UsePurchasePackRequest) => {
      return axios({
        method: POST,
        url: `/api/v1/cards/purchase/${packType}/${uid}`,
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(UseGetUserCardsKey)
      },
    }
  )

  return {
    purchasePack: mutate,
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default usePurchasePack
