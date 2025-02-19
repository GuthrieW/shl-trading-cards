import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'
import { invalidateQueries } from './invalidate-queries'
import { useSession } from 'contexts/AuthContext'

type UseOpenPackRequest = {
  packID: number
  packType: string
}

type UseOpenPack = {
  openPack: (UseOpenPackRequest) => void
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useOpenPack = (): UseOpenPack => {
  const { session } = useSession()
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    async ({ packID, packType }: UseOpenPackRequest) => {
      return await axios({
        method: POST,
        url: `/api/v3/packs/open/${packID}`,
        data: { packType },
        headers: { Authorization: `Bearer ${session?.token}` },
      })
    },
    {
      onSuccess: (data) => {
        invalidateQueries(queryClient, [`packs`])
      },
      onError: () => {},
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
