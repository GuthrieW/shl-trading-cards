#!/usr/bin/env node

import { GET } from '@constants/http-methods'
import { queryDatabase } from '@pages/api/database/database'
import { ArgumentParser } from 'argparse'
import axios, { AxiosResponse } from 'axios'
import SQL, { SQLStatement } from 'sql-template-strings'
import teamsMap from '@constants/teams-map'

type Position = 'F' | 'D' | 'G'

type IndexPlayer = {
  id: string
  league: number
  season: number
  name: string
  team: string
  screening: number
  gettingOpen: number
  passing: number
  puckhandling: number
  shootingAccuracy: number
  shootingRange: number
  offensiveRead: number
  checking: number
  hitting: number
  positioning: number
  stickchecking: number
  shotBlocking: number
  faceoffs: number
  defensiveRead: number
  acceleration: number
  agility: number
  balance: number
  speed: number
  stamina: number
  strength: number
  fighting: number
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

let parser = new ArgumentParser()

parser.add_argument('--season', {
  type: Number,
  required: true,
})

parser.add_argument('--dryRun', {
  type: Boolean,
  required: true,
})

let args: {
  season?: number
  dryRun?: boolean
} = parser.parse_args()

/**
 * get players from the index API for a season
 */
const getIndexPlayers = async (season: number): Promise<IndexPlayer[]> => {
  const players: AxiosResponse<IndexPlayer[], any> = await axios({
    method: GET,
    url: `https://index.simulationhockey.com/api/v1/players/ratings?season=${season}`,
  })
  if (players.status !== 200) throw new Error('Error fetching players')
  return players.data
}

/**
 * transform index position (LW, C, RW, LD, RD, G) into shl trading cards positons (F, D, G)
 */
const indexPositionToCardPosition = (position: string): Position => {
  switch (position) {
    case 'C':
    case 'LW':
    case 'RW':
      return 'F'
    case 'LD':
    case 'RD':
      return 'D'
    case 'G':
      return 'G'
    default:
      return 'F'
  }
}

/**
 * calculate a card's rarity
 */
const calculateRarity = (position: Position, overall: number): string => {
  if (position === 'F' || position === 'D') {
    if (overall < 100) {
      return 'Diamond'
    } else if (overall > 95 && overall < 90) {
      return 'Ruby'
    } else {
      return 'Gold'
    }
  } else {
    if (overall < 100) {
      return 'Diamond'
    } else if (overall > 95 && overall < 90) {
      return 'Ruby'
    } else {
      return 'Gold'
    }
  }
}

/**
 * calculate a card's position, rarity, and attriubtes
 */
const calculatePlayerRequestData = (
  player: IndexPlayer
): {
  position: Position
  rarity: string
  overall?: number
  skating?: number
  shooting?: number
  hands?: number
  checking?: number
  defense?: number
  high_shots?: number
  low_shots?: number
  quickness?: number
  control?: number
  conditioning?: number
} => {
  const overall = 0
  const skating = 0
  const shooting = 0
  const hands = 0
  const checking = 0
  const defense = 0
  const high_shots = 0
  const low_shots = 0
  const quickness = 0
  const control = 0
  const conditioning = 0
  const position = indexPositionToCardPosition(player.position)
  const rarity = calculateRarity(position, overall)

  return {
    position,
    rarity,
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
  }
}

/**
 * transform a team name to a team ID
 */
const teamNameToId = (teamName: string): number => {
  return Object.values(teamsMap).find((team) => team.abbreviation === teamName)
    .teamID
}

/**
 * check if cards already exist with the same playerId, teamId, player_name and card_rarity
 */
const checkForDuplicatesAndGenerateCardRequestData = async (
  players: IndexPlayer[]
): Promise<CardRequest[]> => {
  const unfilteredPlayerRequests: CardRequest[] = await Promise.all(
    players.map(async (player: IndexPlayer) => {
      const calculatedPlayerData = calculatePlayerRequestData(player)
      const teamId = teamNameToId(player.team)
      const playerResult = await queryDatabase(
        SQL`
        SELECT count(*) as amount
        FROM admin_cards.cards 
        WHERE playerId=${player.id}
          AND teamId=${player.team}
          AND player_name=${player.name}
          AND card_rarity=${calculatedPlayerData.rarity};`
      )

      return !playerResult.amount
        ? ({
            teamID: Number(teamId),
            playerID: Number(player.id),
            player_name: player.name,
            season: player.season,
            card_rarity: calculatedPlayerData.rarity,
            sub_type: 'null',
            position: calculatedPlayerData.position,
            overall: calculatedPlayerData.overall,
            skating: calculatedPlayerData.skating,
            shooting: calculatedPlayerData.shooting,
            hands: calculatedPlayerData.hands,
            checking: calculatedPlayerData.checking,
            defense: calculatedPlayerData.defense,
            high_shots: calculatedPlayerData.high_shots,
            low_shots: calculatedPlayerData.low_shots,
            quickness: calculatedPlayerData.quickness,
            control: calculatedPlayerData.control,
            conditioning: calculatedPlayerData.conditioning,
          } as CardRequest)
        : null
    })
  )

  return unfilteredPlayerRequests.filter((cardRequest) => !!cardRequest)
}

/**
 * send card requests to the trading cards API
 */
const requestCards = async (
  cardRequests: CardRequest[],
  isDryRun: boolean
): Promise<string> => {
  const cardRows: string[] = cardRequests.map((cardRequest: CardRequest) => {
    return `(${cardRequest.player_name}, ${cardRequest.teamID}, ${cardRequest.playerID}, ${cardRequest.card_rarity}, ${cardRequest.sub_type}, 0, 0, ${cardRequest.position}, ${cardRequest.overall}, ${cardRequest.high_shots}, ${cardRequest.low_shots}, ${cardRequest.quickness}, ${cardRequest.control}, ${cardRequest.conditioning}, ${cardRequest.skating}, ${cardRequest.shooting}, ${cardRequest.hands}, ${cardRequest.checking}, ${cardRequest.defense}, ${cardRequest.season}, 0)`
  })

  const insertQuery: SQLStatement = SQL`
    INSERT INTO admin_cards.cards
      (player_name, teamID, playerID, card_rarity, sub_type, pullable, approved, position, overall, high_shots, low_shots, quickness, control, conditioning, skating, shooting, hands, checking, defense, season, author_paid)
    VALUES
    ${cardRows.join(',\n')};
  `

  if (isDryRun) {
    console.log('generate-card-requests.ts dry run')
    return `card request insert query:\n${insertQuery}`
  }

  const result = await queryDatabase(insertQuery)
  return result
}

async function main() {
  if (!args.season) throw new Error('argument --season number required')
  if (!args.season) throw new Error('argument --dryRun required')

  const players: IndexPlayer[] = await getIndexPlayers(args.season)
  const cardRequests: CardRequest[] =
    await checkForDuplicatesAndGenerateCardRequestData(players)
  const cardRequestResult: string = await requestCards(
    cardRequests,
    args.dryRun
  )
  console.log(cardRequestResult)
}

void main()
  .then(async () => {
    console.log('Finished generating card requests')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(2)
  })
