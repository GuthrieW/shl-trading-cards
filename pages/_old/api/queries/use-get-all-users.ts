import { useQuery } from 'react-query'
import axios from 'axios'
import { GET } from '@constants/http-methods'

type GetAllUsersRequest = {}

type UseGetallUsers = {
  users: User[]
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const UseGetAllUserKey = 'use-get-all-users'

const useGetallUsers = ({}: GetAllUsersRequest): UseGetallUsers => {
  const { data, error, isFetching, isSuccess } = useQuery(
    UseGetAllUserKey,
    async () => {
      return await axios({
        method: GET,
        url: '/api/v2/users',
      })
    }
  )

  return {
    users: data?.data || [],
    isSuccess: isSuccess,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetallUsers
