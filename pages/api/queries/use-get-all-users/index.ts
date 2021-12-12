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

function queryGetAllUsers({}: GetAllUsersRequest) {
  return useQuery(UseGetAllUsersKey, async () => {
    const { data } = await axios({
      method: GET,
      url: ``,
    })
    return data
  })
}

const useGetAllUsers = ({}: GetAllUsersRequest): UseGetAllUsers => {
  const { data, error, isFetching } = queryGetAllUsers({})

  return {
    users: users.data,
    // users: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetAllUsers
