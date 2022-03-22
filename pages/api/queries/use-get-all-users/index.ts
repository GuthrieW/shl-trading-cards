import { useQuery } from 'react-query'
import axios from 'axios'
import { GET } from '@constants/http-methods'

type GetAllUsersRequest = {}

type UseGetAllUsers = {
  users: User[]
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const UseGetAllUsersKey = 'use-get-all-users'

const useGetAllUsers = ({}: GetAllUsersRequest): UseGetAllUsers => {
  const { data, error, isFetching, isSuccess } = useQuery(
    UseGetAllUsersKey,
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

export default useGetAllUsers
