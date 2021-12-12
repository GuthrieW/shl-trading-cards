import { GET } from '@constants/http-methods'
import cards from '@utils/test-data/cards.json'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetLatestPackCardsRequest = {
  uid: number
}

type UseGetLatestPackCards = {
  latestPackCards: Card[]
  isLoading: boolean
  isError: any
}

const UseGetLatestPackCardsKey = 'use-get-latest-pack-cards'

function queryGetLatestPackCards({ uid }: UseGetLatestPackCardsRequest) {
  return useQuery(UseGetLatestPackCardsKey, async () => {
    const { data } = await axios({
      method: GET,
      url: `/api/v1/collections/latest-pack/${uid}`,
    })
    return data
  })
}

const useGetLatestPackCards = ({
  uid,
}: UseGetLatestPackCardsRequest): UseGetLatestPackCards => {
  const { data, error, isFetching } = queryGetLatestPackCards({ uid })
  return {
    latestPackCards: cards.data.slice(0, 6),
    // latestPackCards: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetLatestPackCards
