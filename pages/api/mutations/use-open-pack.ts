import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'
import { invalidateQueries } from './invalidate-queries'
import { toastService } from 'services/toastService'

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
        url: `/api/v3/packs/open/${packID}`,
        data: {},
      })
    },
    {
      onSuccess: (data) => {
        invalidateQueries(queryClient, [`daily-subscription`])
        toastService.successToast({
          title: 'Opening Pack',
          description: `Good luck!`,
        })
      },
      onError: () => {
        toastService.errorToast({
          title: 'Error Opening Pack',
        })
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
