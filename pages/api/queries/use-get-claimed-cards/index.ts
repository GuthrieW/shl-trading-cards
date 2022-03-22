import { GET } from '@constants/http-methods'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetClaimedCardsRequest = {
  uid: number
}

type UseGetClaimedCards = {
  claimedCards: Card[]
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const UseGetClaimedCardsKey = 'use-get-claimed-cards'

const useGetClaimedCards = ({
  uid,
}: UseGetClaimedCardsRequest): UseGetClaimedCards => {
  const { data, error, isFetching, isSuccess } = useQuery(
    UseGetClaimedCardsKey,
    async () => {
      return await axios({ method: GET, url: `/api/v2/cards/claimed/${uid}` })
    }
  )

  return {
    claimedCards: data?.data || [],
    isSuccess: isSuccess,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetClaimedCards
