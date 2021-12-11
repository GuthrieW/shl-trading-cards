import { useMutation } from 'react-query'
import axios from 'axios'

type UseCreateRequestedCard = {
  response: any
  isLoading: boolean
  isError: any
}

function queryCreateRequestedCard(requestedCard: CardRequest) {
  return useMutation(() => {
    return axios({
      method: 'POST',
      url: '',
      data: requestedCard,
    })
  })
}

const useCreateRequestedCard = (
  requestedCard: CardRequest
): UseCreateRequestedCard => {
  const { status, data, error, isLoading } =
    queryCreateRequestedCard(requestedCard)
  return {
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useCreateRequestedCard
