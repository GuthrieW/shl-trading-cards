import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { PATCH } from '@constants/http-methods'
import { UseGetRequestedCardsKey } from '@pages/api/queries/use-get-requested-cards'
import { UseGetUnapprovedCardsKey } from '@pages/api/queries/use-get-unapproved-cards'
import { UseGetAllCardsKey } from '@pages/api/queries/use-get-all-cards'
import { errorToast, successToast } from '@utils/toasts'
import { invalidateQueries } from './invalidate-queries'

type UseDenyCardRequest = {
  cardID: number
}

type UseDenyCard = {
  denyCard: (UseDenyCardRequest) => void
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useDenyCard = (): UseDenyCard => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    async ({ cardID }: UseDenyCardRequest) => {
      return await axios({
        method: PATCH,
        url: `/api/v2/cards/${cardID}/deny`,
      })
    },
    {
      onSuccess: () => {
        invalidateQueries(queryClient, [
          UseGetAllCardsKey,
          UseGetRequestedCardsKey,
          UseGetUnapprovedCardsKey,
        ])
        successToast({ successText: 'Card Denied' })
      },
      onError: () => {
        errorToast({ errorText: 'Error Denying Card' })
      },
    }
  )

  return {
    denyCard: mutate,
    response: data,
    isSuccess: isSuccess,
    isLoading: isLoading,
    isError: error,
  }
}

export default useDenyCard
