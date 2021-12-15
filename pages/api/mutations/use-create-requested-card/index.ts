import { useMutation } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'

interface UseCreateRequestedCardRequest {
  requestedCard: CardRequest
}

type UseCreateRequestedCard = {
  createRequestedCard: Function
  response: AxiosResponse
  isLoading: boolean
  isError: any
}

const useCreateRequestedCard = (): UseCreateRequestedCard => {
  const { mutate, data, isLoading, isError } = useMutation(
    ({ requestedCard }: UseCreateRequestedCardRequest) => {
      console.log('requestedCard', requestedCard)
      return axios({
        method: POST,
        url: '/api/v1/cards',
        data: { requestedCard },
      })
    }
  )

  return {
    createRequestedCard: mutate,
    response: data,
    isLoading: isLoading,
    isError: isError,
  }
}

export default useCreateRequestedCard
