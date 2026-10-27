import { useEffect, useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import { IndexTeams } from '@pages/api/v3'

export type LeagueTeam = IndexTeams & { leagueID: number }

async function getIndexTeams(leagueID: number): Promise<LeagueTeam[]> {
  const teams: AxiosResponse<IndexTeams[], any> = await axios({
    method: 'GET',
    url: `https://index.simulationhockey.com/api/v1/teams?league=${leagueID}`,
  })
  if (teams.status !== 200) {
    throw new Error(`Error fetching teams from index for league ${leagueID}`)
  }
  return teams.data.map((team) => ({ ...team, leagueID }))
}

export const useGetLeagueInfo = () => {
  const [teams, setTeams] = useState<LeagueTeam[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    Promise.all([getIndexTeams(0), getIndexTeams(1), getIndexTeams(2)])
      .then((leagues) => setTeams(leagues.flat()))
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [])

  return { teams, isLoading, error }
}
