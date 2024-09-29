import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { PATCH } from '@constants/http-methods'
import { UseGetAllCardsKey } from '@pages/api/queries/use-get-all-cards'
import { errorToast, successToast } from '@utils/toasts'
import { invalidateQueries } from './invalidate-queries'

type UseSubmitCardImageRequest = {
  cardID: number
  image: string
}

type UseSubmitCardImage = {
  submitCardImage: (UseSubmitCardImageRequest) => void
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useSubmitCardImage = (): UseSubmitCardImage => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    async ({ cardID, image }: UseSubmitCardImageRequest) => {
      return await axios({
        method: PATCH,
        url: `/api/v2/cards/${cardID}/image`,
        data: { image },
      })
    },
    {
      onSuccess: () => {
        invalidateQueries(queryClient, [UseGetAllCardsKey])
        successToast({ title: 'Card Image Submitted' })
      },
      onError: () => {
        errorToast({ title: 'Error Submitting Card Image' })
      },
    }
  )

  return {
    submitCardImage: mutate,
    response: data,
    isSuccess: isSuccess,
    isLoading: isLoading,
    isError: error,
  }
}

export default useSubmitCardImage
