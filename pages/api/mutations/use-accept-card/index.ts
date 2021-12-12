import { useMutation } from 'react-query'
import { PATCH } from '@constants/http-methods'
import axios from 'axios'

type UseAcceptCardRequest = {
  cardID: number
}

type UseAcceptCard = {
  response: any
  isLoading: boolean
  isError: any
}

function queryAcceptCard({ cardID }: UseAcceptCardRequest) {
  return useMutation(() => {
    return axios({
      method: PATCH,
      url: `/api/v1/cards/${cardID}/approve`,
    })
  })
}

const useAcceptCard = ({ cardID }: UseAcceptCardRequest): UseAcceptCard => {
  const { data, error, isLoading } = queryAcceptCard({ cardID })
  return {
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useAcceptCard
