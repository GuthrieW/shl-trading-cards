import { useQuery } from 'react-query'
import axios from 'axios'
import { GET } from '@constants/http-methods'

type UseGetUserPacksRequest = {
  uid: number
}

type userPacks = {
  quantity: number
  subscribed: number
}

type UseGetUserPacks = {
  userPacks: userPacks
  isLoading: boolean
  isError: any
}

export const UseGetUserPacksKey = 'use-get-user-packs'

const useGetUserPacks = ({ uid }: UseGetUserPacksRequest): UseGetUserPacks => {
  const { data, error, isFetching } = useQuery(UseGetUserPacksKey, async () => {
    return await axios({
      method: GET,
      url: `/api/v1/subscriptions/${uid}`,
    })
  })
  return {
    userPacks: data?.data || [],
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetUserPacks
