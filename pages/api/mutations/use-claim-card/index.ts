import { useMutation } from 'react-query'
import axios from 'axios'

type UseClaimCardRequest = {
  cardID: number
  uid: number
}

type UseClaimCard = {
  response: any
  isLoading: boolean
  isError: any
}

function queryClaimCard({ cardID, uid }: UseClaimCardRequest) {
  return useMutation(() => {
    return axios({
      method: 'PATCH',
      url: `/api/v1/cards/${cardID}/claim/${uid}`,
    })
  })
}

const useClaimCard = ({ cardID, uid }: UseClaimCardRequest): UseClaimCard => {
  const { data, error, isLoading } = queryClaimCard({ cardID, uid })
  return {
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useClaimCard
