import { useMutation } from 'react-query'
import axios from 'axios'

type UseEditCard = {
  response: any
  isLoading: boolean
  isError: any
}

function queryEditCard() {
  return useMutation(() => {
    return axios({
      method: 'POST',
      url: '',
    })
  })
}

const useEditCard = (): UseEditCard => {
  const { status, data, error, isLoading } = queryEditCard()
  return {
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useEditCard
