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
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useSubscriptionAmount = (): UseSubscriptionAmount => {
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    ({ uid, subscriptionAmount }: UseSubscriptionAmountRequest) => {
      return axios({
        method: POST,
        url: `/api/v2/settings/${uid}/subscription/${subscriptionAmount}`,
        data: {},
      })
    }
  )

  return {
    updateSubscriptionAmount: mutate,
    response: data,
    isSuccess: isSuccess,
    isLoading: isLoading,
    isError: error,
  }
}

export default useSubscriptionAmount
