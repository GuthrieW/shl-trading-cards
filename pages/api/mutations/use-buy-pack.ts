import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'
import { invalidateQueries } from './invalidate-queries'
import { useToast } from '@chakra-ui/react'
import { errorToastOptions, successToastOptions } from '@utils/toast'
import { useSession } from 'contexts/AuthContext'

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
  const { session } = useSession()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    ({ uid, packType }: UseBuyPackRequest) => {
      return axios({
        method: POST,
        url: `/api/v3/packs/buy/${packType}/${uid}`,
        data: {},
        headers: { Authorization: `Bearer ${session?.token}` },
      })
    },
    {
      onSuccess: (data) => {
        invalidateQueries(queryClient, [`daily-subscription`])
        toast({
          title: 'Purchasing Pack',
          description: `Navigate to Open Packs to open the pack`,
          ...successToastOptions,
        })
      },
      onError: (error: any) => {
        const errorData = error.response?.data?.error
        const errorMessage =
          typeof errorData === 'string'
            ? errorData
            : errorData?.errorMessage ||
              'An error while trying to purchase a pack. Refresh or try again later'

        toast({
          title: 'Error Purchasing Pack',
          description: errorMessage,
          ...errorToastOptions,
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
