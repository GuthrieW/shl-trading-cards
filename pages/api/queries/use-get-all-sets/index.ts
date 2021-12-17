import { useQuery } from 'react-query'
import axios from 'axios'
import { GET } from '@constants/http-methods'

type UseGetAllSetsRequest = {}

type UseGetAllSets = {
  allSets: CardSet[]
  isLoading: boolean
  isError: any
}

export const UseGetAllSetsKey = 'use-get-all-sets'

const useGetAllSets = ({}: UseGetAllSetsRequest): UseGetAllSets => {
  const { data, error, isFetching } = useQuery(UseGetAllSetsKey, async () => {
    return await axios({
      method: GET,
      url: '/api/v1/sets',
    })
  })

  return {
    allSets: data?.data || [],
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetAllSets
