import { useMutation, useQueryClient } from 'react-query'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'
import { invalidateQueries } from './invalidate-queries'
import { useSession } from 'contexts/AuthContext'
import { useToast } from '@chakra-ui/react'
import { successToastOptions } from '@utils/toast'

type UseCardBuyRequest = {
  card: MarketplaceCard
}

type UseCardBuy = {
  buyCard: (UseCardBuyRequest) => void
  response: AxiosResponse
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

const useBuyCard = (): UseCardBuy => {
  const toast = useToast()
  const { session } = useSession()
  const queryClient = useQueryClient()
  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    async ({ card }: UseCardBuyRequest) => {
      return await axios({
        method: POST,
        url: `/api/v3/marketplace/buy/${card.cardID}`,
        data: { card },
        headers: { Authorization: `Bearer ${session?.token}` },
      })
    },
    {
      onSuccess: (data) => {
        invalidateQueries(queryClient, [`marketplace`])
        toast({ title: 'Card Purchased!', ...successToastOptions })
      },
      onError: () => {},
    }
  )

  return {
    buyCard: mutate,
    response: data,
    isSuccess: isSuccess,
    isLoading: isLoading,
    isError: error,
  }
}

export default useBuyCard
