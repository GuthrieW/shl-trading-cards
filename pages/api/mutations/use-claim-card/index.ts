import { useMutation } from 'react-query'
import axios from 'axios'

type UseClaimCard = {
  response: any
  isLoading: boolean
  isError: any
}

function queryClaimCard() {
  return useMutation(() => {
    return axios({
      method: 'POST',
      url: '',
    })
  })
}

const useClaimCard = (): UseClaimCard => {
  const { status, data, error, isLoading } = queryClaimCard()
  return {
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useClaimCard
