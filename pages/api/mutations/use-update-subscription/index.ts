import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'
import { UseGetUserKey } from '@pages/api/queries/use-get-user'

type UseUpdateSubscriptionRequest = {
  uid: number
  subscriptionAmount: number
}

type UseUpdateSubscription = {
  updateSubscription: Function
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useUpdateSubscription = (): UseUpdateSubscription => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    ({ uid, subscriptionAmount }: UseUpdateSubscriptionRequest) => {
      return axios({
        method: POST,
        url: `/api/v2/settings/${uid}/subscription/${subscriptionAmount}`,
        data: {},
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(UseGetUserKey)
      },
    }
  )

  return {
    updateSubscription: mutate,
    response: data,
    isSuccess: isSuccess,
    isLoading: isLoading,
    isError: error,
  }
}

export default useUpdateSubscription
