#!/usr/bin/env node
import { queryDatabase } from '../pages/api/database/database'
import { ArgumentParser } from 'argparse'
import axios, { AxiosResponse } from 'axios'
import SQL, { SQLStatement } from 'sql-template-strings'
import { CardRequest } from '../index.d'
import {
  calculateAttributesAndPosition,
  calculateRarity,
  getSameAndHigherRaritiesQueryFragment,
  teamNameToId,
} from './generate-card-requests.utils'
import { GET } from '../constants/http-methods'

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

type ImportError = {
  error: string
  player: IndexPlayer
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
  season?: number
  dryRun?: boolean
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
  if (!args.season) throw new Error('argument --season number required')
  if (!args.dryRun) throw new Error('argument --dryRun required')

  const skaters: IndexPlayer[] = await getIndexSkaters(args.season)
  const goalies: IndexPlayer[] = await getIndexGoalies(args.season)
  const cardRequests: CardRequest[] =
    await checkForDuplicatesAndGenerateCardRequestData([...skaters, ...goalies])
  const cardRequestResult: string = await requestCards(
    cardRequests,
    args.dryRun
  )
  console.log(cardRequestResult)
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
 * check if cards already exist with the same playerId, teamId, player_name and card_rarity
 */
async function checkForDuplicatesAndGenerateCardRequestData(
  players: IndexPlayer[]
): Promise<CardRequest[]> {
  const errors: ImportError[] = []
  const unfilteredPlayerRequests: CardRequest[] = await Promise.all(
    players.map(async (player: IndexPlayer) => {
      try {
        const {
          position,
          overall,
          skating,
          shooting,
          hands,
          checking,
          defense,
          high_shots,
          low_shots,
          quickness,
          control,
          conditioning,
        } = calculateAttributesAndPosition(player)
        const rarity = calculateRarity(position, overall)
        const teamId = teamNameToId(player.team)
        const raritiesToCheck = getSameAndHigherRaritiesQueryFragment(rarity)

        const playerResult = await queryDatabase(
          SQL`
        SELECT count(*) as amount
        FROM admin_cards.cards 
        WHERE playerId=${player.id}
          AND teamId=${player.team}
          AND player_name='${player.name}'
          AND ${raritiesToCheck};`
        )

        return !playerResult.amount
          ? ({
              teamID: Number(teamId),
              playerID: Number(player.id),
              player_name: player.name,
              season: player.season,
              card_rarity: rarity,
              sub_type: 'null',
              position,
              overall,
              skating,
              shooting,
              hands,
              checking,
              defense,
              high_shots,
              low_shots,
              quickness,
              control,
              conditioning,
            } as CardRequest)
          : null
      } catch (e) {
        errors.push({ error: e, player })
        return null
      }
    })
  )

  if (errors.length !== 0) {
    console.log(
      'error generating requests for: ',
      JSON.stringify(errors, null, 2)
    )
  } else {
    console.log('No errors while generating card requests!')
  }

  return unfilteredPlayerRequests.filter((cardRequest) => !!cardRequest)
}

/**
 * send card requests to the trading cards database
 */
async function requestCards(
  cardRequests: CardRequest[],
  isDryRun: boolean
): Promise<string> {
  const cardRows: string[] = cardRequests.map((cardRequest: CardRequest) => {
    return `('${cardRequest.player_name}', ${cardRequest.teamID}, ${cardRequest.playerID}, '${cardRequest.card_rarity}', '${cardRequest.sub_type}', 0, 0, '${cardRequest.position}', ${cardRequest.overall}, ${cardRequest.high_shots}, ${cardRequest.low_shots}, ${cardRequest.quickness}, ${cardRequest.control}, ${cardRequest.conditioning}, ${cardRequest.skating}, ${cardRequest.shooting}, ${cardRequest.hands}, ${cardRequest.checking}, ${cardRequest.defense}, ${cardRequest.season}, 0)`
  })

  const insertQuery: SQLStatement = SQL`
    INSERT INTO admin_cards.cards
      (player_name, teamID, playerID, card_rarity, sub_type, pullable, approved, position, overall, high_shots, low_shots, quickness, control, conditioning, skating, shooting, hands, checking, defense, season, author_paid)
    VALUES
    ${cardRows.join(',\n')};
  `

  if (isDryRun) {
    console.log(JSON.stringify(insertQuery, null, 2))
    return 'Dry run finished'
  }

  const result = await queryDatabase(insertQuery)
  return result
}
