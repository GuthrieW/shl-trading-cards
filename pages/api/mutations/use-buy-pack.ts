import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'
import { UseGetUserCardsKey } from '@pages/api/queries/use-get-user-cards'
import { UseGetUserKey } from '@pages/api/queries/use-get-user'
import { errorToast, successToast } from '@utils/toasts'
import { invalidateQueries } from './invalidate-queries'
import { useToast } from '@chakra-ui/react'

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
  const toast = useToast();
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
        invalidateQueries(queryClient, [`daily-subscription`]);
        toast({
          title: 'Purchasing Pack',
          description: `Good job!`,
          status: 'success',
          duration: 2500,
          isClosable: true,
        });
      },
      onError: () => {
        toast({
          title: 'Error Purchasing Pack',
          description: 'Could be an error or already purchased 3 packs today',
          status: 'error',
          duration: 2500,
          isClosable: true,
        });
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
