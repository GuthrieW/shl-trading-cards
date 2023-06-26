import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'
import { UseGetUserKey } from '@pages/api/queries/use-get-user'
import { errorToast, successToast } from '@utils/toasts'
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
        url: `/api/v2/settings/${uid}/subscription/${subscriptionAmount}`,
        data: {},
      })
    },
    {
      onSuccess: (data) => {
        invalidateQueries(queryClient, [`${UseGetUserKey}/${data.data.uid}`])
        successToast({ successText: 'Subscription Updated' })
      },
      onError: () => {
        errorToast({ errorText: 'Error Updating Subscription' })
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
