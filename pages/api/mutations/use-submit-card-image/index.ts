import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { PATCH } from '@constants/http-methods'
import { UseGetAllCardsKey } from '@pages/api/queries/use-get-all-cards'
import { errorToast, successToast } from '@hooks/use-toast'

type UseSubmitCardImageRequest = {
  cardID: number
  image: string
}

type UseSubmitCardImage = {
  submitCardImage: Function
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useSubmitCardImage = (): UseSubmitCardImage => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    ({ cardID, image }: UseSubmitCardImageRequest) => {
      return axios({
        method: PATCH,
        url: `/api/v2/cards/${cardID}/image`,
        data: { image },
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(UseGetAllCardsKey)
        successToast({ successText: 'Card Image Submitted' })
      },
      onError: () => {
        errorToast({ errorText: 'Error Submitting Card Image' })
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
