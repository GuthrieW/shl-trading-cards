import cards from '@utils/test-data/cards.json'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseGetStartingLineup = {
  startingLineup: any
  isLoading: boolean
  isError: any
}

const UseGetStartingLineupKey = 'use-get-starting-lineup'

function queryGetStartingLineup() {
  return useQuery(UseGetStartingLineupKey, async () => {
    const { data } = await axios.get('')
    return data
  })
}

const useGetStartingLineup = (): UseGetStartingLineup => {
  const { data, error, isFetching } = queryGetStartingLineup()

  return {
    startingLineup: cards.data.slice(0, 6),
    // unapprovedCards: data,
    isLoading: isFetching,
    isError: error,
  }
}

export default useGetStartingLineup
