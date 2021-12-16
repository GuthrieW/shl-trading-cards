import { useQuery } from 'react-query'
import axios from 'axios'
import { GET } from '@constants/http-methods'

type UseGetCurrentUserRequest = {
  uid: number
}

type UseGetCurrentUser = {
  user: User
  isLoading: boolean
  isError: any
}

export const UseGetCurrentUserKey = 'use-get-current-user'

const useGetCurrentUser = ({
  uid,
}: UseGetCurrentUserRequest): UseGetCurrentUser => {
  const { data, error, isFetching } = useQuery(
    UseGetCurrentUserKey,
    async () => {
      return await axios({
        method: GET,
        url: `/api/v1/users/current/${uid}`,
      })
    }
  )

  return {
    user: data?.data[0] || {},
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetCurrentUser
