import { useMutation } from 'react-query'
import axios from 'axios'

type UseSubmitCardImage = {
  response: any
  isLoading: boolean
  isError: any
}

function querySubmitCardImage() {
  return useMutation(() => {
    return axios({
      method: 'POST',
      url: '',
    })
  })
}

const useSubmitCardImage = (): UseSubmitCardImage => {
  const { status, data, error, isLoading } = querySubmitCardImage()
  return {
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useSubmitCardImage
