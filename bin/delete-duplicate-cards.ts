#!/usr/bin/env node
import { ArgumentParser } from 'argparse'
import axios, { AxiosResponse } from 'axios'
import { GET } from '../constants/http-methods'
import SQL, { SQLStatement } from 'sql-template-strings'
import { queryDatabase } from '@pages/api/database/database'

export type Position = 'F' | 'D' | 'G'

export type IndexSkaterAttributes = {
  screening?: number
  gettingOpen?: number
  passing?: number
  puckhandling?: number
  shootingAccuracy?: number
  shootingRange?: number
  offensiveRead?: number
  checking?: number
  hitting?: number
  positioning?: number
  stickchecking?: number
  shotBlocking?: number
  faceoffs?: number
  defensiveRead?: number
  acceleration?: number
  agility?: number
  balance?: number
  speed?: number
  stamina?: number
  strength?: number
  fighting?: number
}

export type IndexGoalieAttributes = {
  blocker?: number
  glove?: number
  passing?: number
  pokeCheck?: number
  positioning?: number
  rebound?: number
  recovery?: number
  puckhandling?: number
  lowShots?: number
  reflexes?: number
  skating?: number
  mentalToughness?: number
  goalieStamina?: number
}

export type IndexPlayer = IndexSkaterAttributes &
  IndexGoalieAttributes & {
    id: string
    league: number
    season: number
    name: string
    team: string
    aggression: number
    bravery: number
    determination: number
    teamPlayer: number
    leadership: number
    temperament: number
    professionalism: number
    position: string
    appliedTPE: number
  }

export type DeleteRequest = {
  cardId: string
}

let parser = new ArgumentParser()

parser.addArgument('--season', {
  type: Number,
  required: true,
})

parser.addArgument('--dryRun', {
  type: Boolean,
  required: true,
})

let args: {
  season: number
  dryRun: boolean
} = parser.parseArgs()

void main()
  .then(async () => {
    console.log('Finished generating card requests')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(2)
  })

async function main() {
  if (!args.season) throw new Error('argument --season required')
  if (!args.season) throw new Error('argument --dryRun required')

  const skaters: IndexPlayer[] = await getIndexSkaters(args.season)
  const goalies: IndexPlayer[] = await getIndexGoalies(args.season)
  const deleteRequests: DeleteRequest[] =
    await checkForDuplicatesAndGenerateDeleteQueries([...skaters, ...goalies])
  const deleteRequestsResult: string[] = await deleteCards(
    deleteRequests,
    args.dryRun
  )
  console.log(JSON.stringify(deleteRequestsResult, null, 2))
}

/**
 * get skaters from the index API for a season
 */
async function getIndexSkaters(season: number): Promise<IndexPlayer[]> {
  const players: AxiosResponse<IndexPlayer[], any> = await axios({
    method: GET,
    url: `https://index.simulationhockey.com/api/v1/players/ratings?season=${season}`,
  })
  if (players.status !== 200) throw new Error('Error fetching skaters')
  return players.data
}

/**
 * get goalies from the index API for a season
 */
async function getIndexGoalies(season: number): Promise<IndexPlayer[]> {
  const players: AxiosResponse<IndexPlayer[], any> = await axios({
    method: GET,
    url: `https://index.simulationhockey.com/api/v1/goalies/ratings?season=${season}`,
  })
  if (players.status !== 200) throw new Error('Error fetching goalies')
  return players.data
}

/**
 * check for duplicate cards based on
 */
async function checkForDuplicatesAndGenerateDeleteQueries(
  players: IndexPlayer[]
): Promise<DeleteRequest[]> {
  return null
}

/**
 * send delete requests to the trading cards database
 */
async function deleteCards(
  deleteRequests: DeleteRequest[],
  isDryRun: boolean
): Promise<string[]> {
  const deleteQueries: SQLStatement[] = deleteRequests.map(
    (deleteRequest: DeleteRequest) => {
      return SQL`DELETE FROM admin_cards.cards WHERE cardId=${deleteRequest.cardId};`
    }
  )

  if (isDryRun) {
    console.log(JSON.stringify(deleteQueries, null, 2))
    return ['Dry run finished']
  }

  const results = await Promise.all(
    deleteQueries.map(async (deleteQuery) => await queryDatabase(deleteQuery))
  )
  return results
}
