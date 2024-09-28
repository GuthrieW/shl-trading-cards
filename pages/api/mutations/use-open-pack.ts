import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'
import { UseGetUserPacksKey } from '@pages/api/queries/use-get-user-packs'
import { UseGetUserCardsKey } from '@pages/api/queries/use-get-user-cards'
import { errorToast, successToast } from '@utils/toasts'
import { invalidateQueries } from './invalidate-queries'
import { useToast } from '@chakra-ui/react'

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
  const toast = useToast()
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
        invalidateQueries(queryClient, [`daily-subscription`]);
        toast({
          title: 'Opening Pack',
          description: `Good luck!`,
          status: 'success',
          duration: 2500,
          isClosable: true,
        });
      },
      onError: () => {
        toast({
          title: 'Error Opening Pack',
          status: 'error',
          duration: 2500,
          isClosable: true,
        });
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
