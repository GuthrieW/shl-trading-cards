import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'
import { invalidateQueries } from './invalidate-queries'

type UseUpdateSubscriptionRequest = {
  uid: number
  subscriptionAmount: number
}

type UseUpdateSubscription = {
  updateSubscription: (UseUpdateSubscriptionRequest) => void
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useUpdateSubscription = (): UseUpdateSubscription => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    async ({ uid, subscriptionAmount }: UseUpdateSubscriptionRequest) => {
      return await axios({
        method: POST,
        url: `/api/v3/settings/daily/${uid}`,
        data: { subscription: subscriptionAmount },
      })
    },
    {
      onSuccess: (data) => {
        invalidateQueries(queryClient, [`daily-subscription`])
      },
      onError: () => {},
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

function toast(arg0: {
  title: string
  description: string
  status: string
  duration: number
  isClosable: boolean
}) {
  throw new Error('Function not implemented.')
}
