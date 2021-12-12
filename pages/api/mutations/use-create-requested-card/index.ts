import { useMutation } from 'react-query'
import axios from 'axios'

type UseCreateRequestedCardRequest = {
  requestedCard: CardRequest
}

type UseCreateRequestedCard = {
  response: any
  isLoading: boolean
  isError: any
}

function queryCreateRequestedCard({
  requestedCard,
}: UseCreateRequestedCardRequest) {
  return useMutation(() => {
    return axios({
      method: 'POST',
      url: '/api/v1/cards',
      data: requestedCard,
    })
  })
}

const useCreateRequestedCard = ({
  requestedCard,
}: UseCreateRequestedCardRequest): UseCreateRequestedCard => {
  const { data, error, isLoading } = queryCreateRequestedCard({ requestedCard })
  return {
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useCreateRequestedCard
