import { useQuery, useQueryClient } from 'react-query'
import axios from 'axios'
import { POST } from '@constants/http-methods'
import { invalidateQueries } from '../mutations/invalidate-queries'

export type CardOwner = {
  username: string
  userID: string
  cardID: string
  player_name: string
  card_rarity: string
  image_url: string
}

type UseGetCardOwnersRequest = {
  name: string
  rarities: string[]
  teams: string[]
  page: number
}

type UseGetCardOwners = {
  cardOwners: CardOwner[]
  total: number
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
  page,
}: UseGetCardOwnersRequest): UseGetCardOwners => {
  const queryClient = useQueryClient()
  const { data, error, isFetching, isSuccess, refetch } = useQuery(
    UseGetCardOwnersKey,
    async () => {
      if (name.length === 0 && teams.length === 0 && rarities.length === 0) {
        return
      }

      return await axios({
        method: POST,
        url: `/api/v2/cards/owners`,
        data: { name, rarities, teams, page },
      })
    },
    {
      onSuccess: () => {
        invalidateQueries(queryClient, [])
      },
      onError: () => {},
      enabled: false,
      refetchOnWindowFocus: false,
    }
  )

  return {
    cardOwners: data?.data.cards || [],
    total: data?.data.total || 0,
    isSuccess: isSuccess,
    isLoading: isFetching,
    isError: error,
    refetch,
  }
}

export default useGetCardOwners
