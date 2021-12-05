import useSWR from 'swr'

type UseShlTeams = {
  teams: any[]
  isLoading: boolean
  isError: boolean
}

const useShlTeams = (): UseShlTeams => {
  const { data, error } = useSWR(() => ``)

  return {
    teams: [],
    isLoading: !data && !error,
    isError: error,
  }
}

export default useShlTeams
