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

const useGetLatestPackCards = ({
  uid,
}: UseGetLatestPackCardsRequest): UseGetLatestPackCards => {
  const { data, error, isFetching } = useQuery(
    UseGetLatestPackCardsKey,
    async () => {
      return await axios({
        method: GET,
        url: `/api/v1/collections/latest-pack/${uid}`,
      })
    }
  )
  return {
    latestPackCards: data.data || [],
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetLatestPackCards
