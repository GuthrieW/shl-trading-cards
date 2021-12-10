import { useMutation } from 'react-query'
import axios from 'axios'

type UseAcceptCard = {
  response: any
  isLoading: boolean
  isError: any
}

function queryAcceptCard() {
  return useMutation(() => {
    return axios({
      method: 'POST',
      url: '',
    })
  })
}

const useAcceptCard = (): UseAcceptCard => {
  const { status, data, error, isLoading } = queryAcceptCard()
  return {
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useAcceptCard
