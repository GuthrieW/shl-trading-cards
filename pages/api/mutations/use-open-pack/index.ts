import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'
import { UseGetUserPacksKey } from '@pages/api/queries/use-get-user-packs'
import { UseGetUserCardsKey } from '@pages/api/queries/use-get-user-cards'
import { errorToast, successToast } from '@utils/toasts'

type UseOpenPackRequest = {
  packID: number
}

type UseOpenPack = {
  openPack: (UseOpenPackRequest) => void
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useOpenPack = (): UseOpenPack => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    async ({ packID }: UseOpenPackRequest) => {
      return await axios({
        method: POST,
        url: `/api/v2/packs/open/${packID}`,
        data: {},
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(UseGetUserPacksKey)
        queryClient.invalidateQueries(UseGetUserCardsKey)
        successToast({ successText: 'Pack Opened' })
      },
      onError: () => {
        errorToast({ errorText: 'Error Opening Pack' })
      },
    }
  )

  return {
    openPack: mutate,
    response: data,
    isSuccess: isSuccess,
    isLoading: isLoading,
    isError: error,
  }
}

export default useOpenPack
