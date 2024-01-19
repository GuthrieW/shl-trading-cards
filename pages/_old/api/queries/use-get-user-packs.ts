import { useQuery } from 'react-query'
import axios from 'axios'
import { GET } from '@constants/http-methods'

type UseGetUserPacksRequest = {
  uid: number
}

type UseGetUserPacks = {
  userPacks: UserPack[]
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const UseGetUserPacksKey = 'use-get-user-packs'

const useGetUserPacks = ({ uid }: UseGetUserPacksRequest): UseGetUserPacks => {
  const { data, error, isFetching, isSuccess } = useQuery(
    `${UseGetUserPacksKey}/${uid}`,
    async () => {
      return await axios({
        method: GET,
        url: `/api/v2/packs/${uid}`,
      })
    }
  )

  return {
    userPacks: data?.data || [],
    isSuccess: isSuccess,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetUserPacks
