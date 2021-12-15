import { useMutation } from 'react-query'
import { PATCH } from '@constants/http-methods'
import axios, { AxiosResponse } from 'axios'

type UseAcceptCardRequest = {
  cardID: number
}

type UseAcceptCard = {
  acceptCard: Function
  response: AxiosResponse
  isLoading: boolean
  isError: any
}

const useAcceptCard = (): UseAcceptCard => {
  const { mutate, data, error, isLoading } = useMutation(
    ({ cardID }: UseAcceptCardRequest) => {
      return axios({
        method: PATCH,
        url: `/api/v1/cards/${cardID}/approve`,
      })
    }
  )
  return {
    acceptCard: mutate,
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useAcceptCard
