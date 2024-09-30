import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'
import { invalidateQueries } from './invalidate-queries'
import { toastService } from 'services/toastService'

type UseBuyPackRequest = {
  uid: number
  packType: PackKey
}

type UseBuyPack = {
  buyPack: (request: UseBuyPackRequest) => void
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useBuyPack = (): UseBuyPack => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    ({ uid, packType }: UseBuyPackRequest) => {
      return axios({
        method: POST,
        url: `/api/v3/packs/buy/${packType}/${uid}`,
        data: {},
      })
    },
    {
      onSuccess: (data) => {
        invalidateQueries(queryClient, [`daily-subscription`])
        toastService.successToast({
          title: 'Purchasing Pack',
          description: `Good job!`,
        })
      },
      onError: () => {
        toastService.errorToast({
          title: 'Error Purchasing Pack',
          description: 'Could be an error or already purchased 3 packs today',
        })
      },
    }
  )

  return {
    buyPack: mutate,
    response: data,
    isSuccess: isSuccess,
    isLoading: isLoading,
    isError: error,
  }
}

export default useBuyPack
