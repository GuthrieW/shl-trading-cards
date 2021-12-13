import { GET } from '@constants/http-methods'
import cards from '@utils/test-data/cards.json'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetClaimedCardsRequest = {
  uid: number
}

type UseGetClaimedCards = {
  claimedCards: Card[]
  isLoading: boolean
  isError: any
}

const UseGetClaimedCardsKey = 'use-get-claimed-cards'

const useGetClaimedCards = ({
  uid,
}: UseGetClaimedCardsRequest): UseGetClaimedCards => {
  const { data, error, isFetching } = useQuery(
    UseGetClaimedCardsKey,
    async () => {
      return await axios({ method: GET, url: `/api/v1/cards/claimed/${uid}` })
    }
  )

  return {
    claimedCards: cards.data,
    // claimedCards: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetClaimedCards
