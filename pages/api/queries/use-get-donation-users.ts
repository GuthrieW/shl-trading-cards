import { GET } from '@constants/http-methods'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetDonationUsersRequest = {}
type UseGetDonationUsers = {
  donationUsers: User[]
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const UseGetDonationUsersKey = 'use-get-dontaion-users'

const useGetDonationUsers =
  ({}: UseGetDonationUsersRequest): UseGetDonationUsers => {
    const { data, error, isFetching, isSuccess } = useQuery(
      UseGetDonationUsersKey,
      async () => {
        return await axios({
          method: GET,
          url: '/api/v2/users/donations',
        })
      }
    )

    return {
      donationUsers: data?.data || [],
      isSuccess,
      isLoading: isFetching,
      isError: error,
    }
  }

export default useGetDonationUsers
