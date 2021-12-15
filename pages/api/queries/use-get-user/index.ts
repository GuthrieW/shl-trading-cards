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

const useGetUser = ({ uid }: UseGetUserRequest): UseGetUser => {
  const { data, error, isFetching } = useQuery(UseGetUserKey, async () => {
    return await axios({ method: GET, url: `/api/v1/users/${uid}` })
  })

  return {
    user: data.data || {},
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetUser
