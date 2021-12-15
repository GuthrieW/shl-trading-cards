import { UseMutateFunction, useMutation } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { PATCH } from '@constants/http-methods'

type UseDenyCardRequest = {
  cardID: number
}

type UseDenyCard = {
  denyCard: Function
  response: AxiosResponse
  isLoading: boolean
  isError: any
}

const useDenyCard = (): UseDenyCard => {
  const { mutate, data, error, isLoading } = useMutation(
    ({ cardID }: UseDenyCardRequest) => {
      return axios({
        method: PATCH,
        url: `/api/v1/cards/${cardID}/deny`,
      })
    }
  )

  return {
    denyCard: mutate,
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useDenyCard
