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

function queryGetClaimedCards({ uid }: UseGetClaimedCardsRequest) {
  return useQuery(UseGetClaimedCardsKey, async () => {
    const { data } = await axios({
      method: GET,
      url: `/api/v1/cards/claimed/${uid}`,
    })
    return data
  })
}

const useGetClaimedCards = ({
  uid,
}: UseGetClaimedCardsRequest): UseGetClaimedCards => {
  const { data, error, isFetching } = queryGetClaimedCards({ uid })

  return {
    claimedCards: data || [],
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetClaimedCards
