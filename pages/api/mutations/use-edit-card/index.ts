import { useMutation } from 'react-query'
import axios from 'axios'
import { PATCH } from '@constants/http-methods'

type UseEditCardRequest = {
  cardID: number
  newCardData: Card
}

type UseEditCard = {
  response: any
  isLoading: boolean
  isError: any
}

function queryEditCard({ cardID, newCardData }: UseEditCardRequest) {
  return useMutation(() => {
    return axios({
      method: PATCH,
      url: `/api/v1/cards/${cardID}`,
      data: newCardData,
    })
  })
}

const useEditCard = ({
  cardID,
  newCardData,
}: UseEditCardRequest): UseEditCard => {
  const { data, error, isLoading } = queryEditCard({ cardID, newCardData })
  return {
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default useEditCard
