import { useQuery } from 'react-query'
import axios from 'axios'
import { GET } from '@constants/http-methods'

type UseGetSetCardsRequest = {
  setID: number
}

type UsetGetSetCards = {
  setCards: Card[]
  isLoading: boolean
  isError: any
}

export const UseGetSetCardsKey = 'use-get-set-cards'

const useGetAllSets = ({ setID }: UseGetSetCardsRequest): UsetGetSetCards => {
  const { data, error, isFetching } = useQuery(UseGetSetCardsKey, async () => {
    return await axios({
      method: GET,
      url: `/api/v1/card-sets/${setID}`,
    })
  })

  return {
    setCards: data?.data || [],
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetAllSets
