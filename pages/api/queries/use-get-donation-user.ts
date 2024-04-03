import { GET } from '@constants/http-methods'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetDonationUserRequest = {
  uid: number
}
type UseGetDonationUser = {
  donationUser: Donator
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const UseGetDonationUserKey = 'use-get-dontaion-user'

const useGetDonationUser = ({
  uid,
}: UseGetDonationUserRequest): UseGetDonationUser => {
  const { data, error, isFetching, isSuccess } = useQuery(
    UseGetDonationUserKey,
    async () => {
      return await axios({
        method: GET,
        url: `/api/v2/donations/${uid}`,
      })
    }
  )

  return {
    donationUser: data?.data[0],
    isSuccess,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetDonationUser
