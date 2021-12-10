import { useMutation } from 'react-query'
import axios from 'axios'

type UseDenyCard = {
  response: any
  isLoading: boolean
  isError: any
}

function queryDenyCard() {
  return useMutation(() => {
    return axios({
      method: 'POST',
      url: '',
    })
  })
}

const useDenyCard = (): UseDenyCard => {
  const { status, data, error, isLoading } = queryDenyCard()
  return {
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useDenyCard
