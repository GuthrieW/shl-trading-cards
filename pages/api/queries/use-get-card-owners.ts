import { useQuery } from 'react-query'
import axios from 'axios'
import { POST } from '@constants/http-methods'

export type CardOwner = {
  username: string
  uid: number
  quantity: number
}

type UseGetCardOwnersRequest = {
  name: string
  rarities: string[]
  teams: string[]
}

type UseGetCardOwners = {
  cardOwners: { card: Card; users: TradeUser[] }[]
  isSuccess: boolean
  isLoading: boolean
  isError: any
  refetch: () => void
}

export const UseGetCardOwnersKey = 'use-get-card-owners'

const useGetCardOwners = ({
  name,
  rarities,
  teams,
}: UseGetCardOwnersRequest): UseGetCardOwners => {
  const { data, error, isFetching, isSuccess, refetch } = useQuery(
    UseGetCardOwnersKey,
    async () => {
      return await axios({
        method: POST,
        url: `/api/v2/cards/owners`,
        data: { name, rarities, teams },
      })
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  )

  return {
    cardOwners: data?.data || [],
    isSuccess: isSuccess,
    isLoading: isFetching,
    isError: error,
    refetch,
  }
}

export default useGetCardOwners
