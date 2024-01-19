import { useQuery } from 'react-query'
import axios from 'axios'
import { GET } from '@constants/http-methods'

type GetPacksBoughtTodayRequest = {
  uid: number
}

type UseGetPacksBoughtToday = {
  packsBoughtToday: number
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const UseGetPacksBoughtTodayKey = 'use-get-packs-bought-today'

const useGetPacksBoughtToday = ({
  uid,
}: GetPacksBoughtTodayRequest): UseGetPacksBoughtToday => {
  const { data, error, isFetching, isSuccess } = useQuery(
    `${UseGetPacksBoughtTodayKey}/${uid}`,
    async () => {
      return await axios({
        method: GET,
        url: `/api/v2/users/packs-bought/${uid}`,
      })
    }
  )

  return {
    packsBoughtToday: data?.data || 0,
    isSuccess: isSuccess,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetPacksBoughtToday
