import { useMutation } from 'react-query'
import axios from 'axios'

type UseOpenPack = {}

function queryOpenPack() {
  return useMutation(() => {
    return axios({
      method: 'POST',
      url: '',
    })
  })
}

const useOpenPack = () => {
  const { status, data, error, isLoading } = queryOpenPack()
  return {
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useOpenPack
