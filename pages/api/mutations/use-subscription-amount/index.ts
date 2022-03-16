import { useMutation } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'

type UseSubscriptionAmountRequest = {
  uid: number
  subscriptionAmount: number
}

type UseSubscriptionAmount = {
  updateSubscriptionAmount: Function
  response: AxiosResponse
  isLoading: boolean
  isError: any
}

const useSubscriptionAmount = (): UseSubscriptionAmount => {
  const { mutate, data, error, isLoading } = useMutation(
    ({ uid, subscriptionAmount }: UseSubscriptionAmountRequest) => {
      return axios({
        method: POST,
        url: `/api/v1/subscriptions/${uid}`,
        data: { subscriptionAmount: subscriptionAmount },
      })
    }
  )

  return {
    updateSubscriptionAmount: mutate,
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useSubscriptionAmount
