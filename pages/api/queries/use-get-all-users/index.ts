import { useQuery } from 'react-query'
import users from '@utils/test-data/user.json'
import axios from 'axios'
import { GET } from '@constants/http-methods'

type GetAllUsersRequest = {}

type UseGetAllUsers = {
  users: User[]
  isLoading: boolean
  isError: any
}

const UseGetAllUsersKey = 'use-get-all-users'

const useGetAllUsers = ({}: GetAllUsersRequest): UseGetAllUsers => {
  const { data, error, isFetching } = useQuery(UseGetAllUsersKey, async () => {
    return await axios({
      method: GET,
      url: '/api/v1/users',
    })
  })

  return {
    users: data.data || [],
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetAllUsers
