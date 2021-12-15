import { UseMutateFunction, useMutation } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { PATCH } from '@constants/http-methods'

type UseSubmitCardImageRequest = {
  cardID: number
  image: any
}

type UseSubmitCardImage = {
  submitCardImage: Function
  response: AxiosResponse
  isLoading: boolean
  isError: any
}

const useSubmitCardImage = (): UseSubmitCardImage => {
  const { mutate, data, error, isLoading } = useMutation(
    ({ cardID, image }: UseSubmitCardImageRequest) => {
      return axios({
        method: PATCH,
        url: `/api/v1/cards/${cardID}/image`,
        data: image,
      })
    }
  )

  return {
    submitCardImage: mutate,
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useSubmitCardImage
