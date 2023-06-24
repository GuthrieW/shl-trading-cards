import { useQuery } from 'react-query'
import axios from 'axios'
import { GET } from '@constants/http-methods'

type UseGetCardOwnersRequest = {
  cardID: number
}

type UseGetCardOwners = {
  cardOwners: User[]
  isSuccess: boolean
  isLoading: boolean
  isError: any
}

export const UseGetCardOwnersKey = 'use-get-card-owners'

const useGetCardOwners = ({
  cardID,
}: UseGetCardOwnersRequest): UseGetCardOwners => {
  const { data, error, isFetching, isSuccess } = useQuery(
    `${UseGetCardOwnersKey}/${cardID}`,
    async () => {
      return await axios({
        method: GET,
        url: `/api/v2/cards/${cardID}/owners`,
      })
    }
  )

  return {
    cardOwners: data?.data || [],
    isSuccess: isSuccess,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetCardOwners
