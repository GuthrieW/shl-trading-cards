import { GET } from '@constants/http-methods'
import axios from 'axios'
import { User } from 'index.d'
import { useQuery } from 'react-query'

type UseGetUserRequest = {
  uid: number
}

type UseGetUser = {
  user: User
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const UseGetUserKey = 'use-get-user'

const useGetUser = ({ uid }: UseGetUserRequest): UseGetUser => {
  const { data, error, isFetching, isSuccess } = useQuery(
    `${UseGetUserKey}/${uid}`,
    async () => {
      return await axios({ method: GET, url: `/api/v2/users/${uid}` })
    }
  )

  return {
    user: data?.data[0] || {},
    isSuccess: isSuccess,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetUser
