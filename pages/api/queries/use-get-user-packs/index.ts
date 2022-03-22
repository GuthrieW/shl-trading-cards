import { useQuery } from 'react-query'
import axios from 'axios'
import { GET } from '@constants/http-methods'

type UseGetUserPacksRequest = {
  uid: number
}

type userPacks = {
  userID: number
  packType: string
  purchasedDate: Date
}

type UseGetUserPacks = {
  userPacks: userPacks
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const UseGetUserPacksKey = 'use-get-user-packs'

const useGetUserPacks = ({ uid }: UseGetUserPacksRequest): UseGetUserPacks => {
  const { data, error, isFetching, isSuccess } = useQuery(
    UseGetUserPacksKey,
    async () => {
      return await axios({
        method: GET,
        url: `/api/v2/packs/${uid}`,
      })
    }
  )
  return {
    userPacks: data?.data[0] || [],
    isSuccess: isSuccess,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetUserPacks
