import { GET } from '@constants/http-methods'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetLatestPackCardsRequest = {
  uid: number
}

type UseGetLatestPackCards = {
  latestPackCards: Card[]
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const getLatestPackCardsKey = (uid: number) => ['latestPackCards', uid]

const useGetLatestPackCards = ({
  uid,
}: UseGetLatestPackCardsRequest): UseGetLatestPackCards => {
  const { data, error, isFetching, isSuccess } = useQuery(
    getLatestPackCardsKey(uid),
    async () => {
      return await axios({
        method: GET,
        url: `/api/v3/collection/uid/last-pack?uid=${uid}`,
      })
    },
    {
      refetchOnWindowFocus: false,
    }
  )
  return {
    latestPackCards: data?.data || [],
    isSuccess: isSuccess,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetLatestPackCards
