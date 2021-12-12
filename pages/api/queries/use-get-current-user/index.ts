import { GET } from '@constants/http-methods'
import user from '@utils/test-data/user.json'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetCurrentUserRequest = {
  uid: number
}

type UseGetCurrentUser = {
  currentUser: User
  isLoading: boolean
  isError: any
}

const UseGetCurrentUserKey = 'use-get-current-user'

function queryGetCurrentUser({ uid }: UseGetCurrentUserRequest) {
  return useQuery(UseGetCurrentUserKey, async () => {
    const { data } = await axios({
      method: GET,
      url: `/api/v1/users/${uid}`,
    })
    return data
  })
}

const useGetCurrentUser = ({
  uid,
}: UseGetCurrentUserRequest): UseGetCurrentUser => {
  const { data, error, isFetching } = queryGetCurrentUser({ uid })

  return {
    currentUser: user.data[0],
    // currentUser: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetCurrentUser
