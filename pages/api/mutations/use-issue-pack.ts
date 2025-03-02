import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'
import { invalidateQueries } from './invalidate-queries'

type IssuePackRequest = {
  packType: PackKey
  issuerID: number
  receiverID: number
}

type UseIssuePack = {
  issuePack: (IssuePackRequest) => void
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useIssuePack = (): UseIssuePack => {
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    async ({ packType, issuerID, receiverID }: IssuePackRequest) => {
      return await axios({
        method: POST,
        url: `/api/v2/packs/issue-free/${packType}/${issuerID}/${receiverID}`,
        data: {},
      })
    },

    {
      onSuccess: () => {
        invalidateQueries(queryClient, ['packs'])
      },
      onError: () => {},
    }
  )

  return {
    issuePack: mutate,
    response: data,
    isSuccess: isSuccess,
    isLoading: isLoading,
    isError: error,
  }
}

export default useIssuePack
