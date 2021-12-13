import { UseMutateFunction, useMutation } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'

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
  const { mutate, data, error, isLoading } = useMutation(
    ({ packType, uid }: UsePurchasePackRequest) => {
      return axios({
        method: POST,
        url: `/api/v1/cards/purchase/${packType}/${uid}`,
      })
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
