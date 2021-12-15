import { GET } from '@constants/http-methods'
import user from '@utils/test-data/user.json'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetUserRequest = {
  uid: number
}

type UseGetUser = {
  user: User
  isLoading: boolean
  isError: any
}

const UseGetUserKey = 'use-get-user'

function queryGetUser({ uid }: UseGetUserRequest) {
  return useQuery(UseGetUserKey, async () => {
    const { data } = await axios({
      method: GET,
      url: `/api/v1/users/${uid}`,
    })
    return data
  })
}

const useGetUser = ({ uid }: UseGetUserRequest): UseGetUser => {
  const { data, error, isFetching } = queryGetUser({ uid })

  return {
    user: data || {},
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetUser
