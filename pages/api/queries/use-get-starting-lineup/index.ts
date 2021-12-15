import { GET } from '@constants/http-methods'
import cards from '@utils/test-data/cards.json'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetStartingLineupRequest = {
  uid: number
}

type UseGetStartingLineup = {
  startingLineup: any
  isLoading: boolean
  isError: any
}

const UseGetStartingLineupKey = 'use-get-starting-lineup'

function queryGetStartingLineup({ uid }: UseGetStartingLineupRequest) {
  return useQuery(UseGetStartingLineupKey, async () => {
    const { data } = await axios({
      method: GET,
      url: `/api/v1/starting-lineups/${uid}`,
    })
    return data
  })
}

const useGetStartingLineup = ({
  uid,
}: UseGetStartingLineupRequest): UseGetStartingLineup => {
  const { data, error, isFetching } = queryGetStartingLineup({ uid })

  return {
    startingLineup: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetStartingLineup
