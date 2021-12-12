import { useMutation } from 'react-query'
import axios from 'axios'
import { PATCH } from '@constants/http-methods'

type UseSubmitCardImageRequest = {
  cardID: number
  image: any
}

type UseSubmitCardImage = {
  response: any
  isLoading: boolean
  isError: any
}

function querySubmitCardImage({ cardID, image }: UseSubmitCardImageRequest) {
  return useMutation(() => {
    return axios({
      method: PATCH,
      url: `/api/v1/cards/${cardID}/image`,
      data: image,
    })
  })
}

const useSubmitCardImage = ({
  cardID,
  image,
}: UseSubmitCardImageRequest): UseSubmitCardImage => {
  const { data, error, isLoading } = querySubmitCardImage({ cardID, image })
  return {
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useSubmitCardImage
