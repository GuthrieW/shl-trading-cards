import { useQuery } from 'react-query'
import axios from 'axios'
import { GET } from '@constants/http-methods'
import getUidFromSession from '@utils/get-uid-from-session'

type UseGetCurrentUserRequest = {}

type UseGetCurrentUser = {
  user: User
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const UseGetCurrentUserKey = 'use-get-current-user'

const useGetCurrentUser = ({}: UseGetCurrentUserRequest): UseGetCurrentUser => {
  const uid = getUidFromSession()
  const { data, error, isFetching, isSuccess } = useQuery(
    `${UseGetCurrentUserKey}/${uid}`,
    async () => {
      return await axios({
        method: GET,
        url: `/api/v2/users/${uid}`,
      })
    }
  )

  return {
    user: data?.data[0] || {},
    isSuccess: isSuccess,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetCurrentUser
