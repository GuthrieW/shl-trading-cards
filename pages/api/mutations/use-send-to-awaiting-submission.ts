import { PATCH } from '@constants/http-methods'
import { errorToast, successToast } from '@utils/toasts'
import axios, { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query'
import { invalidateQueries } from './invalidate-queries'
import { UseGetAllCardsKey } from '../queries/use-get-all-cards'

type UseSendToAwaitingSubmissionRequest = {
  cardID: number
}

type UseSendToAwaitingSubmission = {
  sendToAwaitingSubmission: (
    UseSendToAwaitingSubmissionRequest: UseSendToAwaitingSubmissionRequest
  ) => void
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useSendToAwaitingSubmission = (): UseSendToAwaitingSubmission => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    async ({ cardID }: UseSendToAwaitingSubmissionRequest) => {
      return await axios({
        method: PATCH,
        url: `/api/v2/cards/${cardID}/awaitingSubmission`,
      })
    },
    {
      onSuccess: () => {
        invalidateQueries(queryClient, [UseGetAllCardsKey])
        successToast({ successText: 'Card Sent to Awaiting Submission' })
      },
      onError: () => {
        errorToast({ errorText: 'Error Sending Card to Awaiting Submission' })
      },
    }
  )

  return {
    sendToAwaitingSubmission: mutate,
    response: data,
    isSuccess: isSuccess,
    isLoading: isLoading,
    isError: error,
  }
}

export default useSendToAwaitingSubmission
