import { useMutation } from 'react-query'
import axios from 'axios'
import { PATCH } from '@constants/http-methods'

type UseDenyCardRequest = {
  cardID: number
}

type UseDenyCard = {
  response: any
  isLoading: boolean
  isError: any
}

function queryDenyCard({ cardID }: UseDenyCardRequest) {
  return useMutation(() => {
    return axios({
      method: PATCH,
      url: `/api/v1/cards/${cardID}/deny`,
    })
  })
}

const useDenyCard = ({ cardID }: UseDenyCardRequest): UseDenyCard => {
  const { data, error, isLoading } = queryDenyCard({ cardID })
  return {
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useDenyCard
