import { UseMutateFunction, useMutation } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { PATCH } from '@constants/http-methods'

type UseClaimCardRequest = {
  cardID: number
  uid: number
}

type UseClaimCard = {
  claimCard: Function
  response: AxiosResponse
  isLoading: boolean
  isError: any
}

const useClaimCard = (): UseClaimCard => {
  const { mutate, data, error, isLoading } = useMutation(
    ({ cardID, uid }: UseClaimCardRequest) => {
      return axios({
        method: PATCH,
        url: `/api/v1/cards/${cardID}/claim/${uid}`,
      })
    }
  )

  return {
    claimCard: mutate,
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useClaimCard
