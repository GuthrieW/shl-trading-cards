#!/usr/bin/env node
import { GET } from '@constants/http-methods'
import { queryDatabase } from '@pages/api/database/database'
import { ArgumentParser } from 'argparse'
import axios, { AxiosResponse } from 'axios'
import SQL, { SQLStatement } from 'sql-template-strings'
import teamsMap from '@constants/teams-map'
import { CardRequest } from '../index.d'
import rarityMap from '@constants/rarity-map'

type Position = 'F' | 'D' | 'G'

type IndexSkaterAttributes = {
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
}

type IndexGoalieAttributes = {
  blocker: number
  glove: number
  passing: number
  pokeCheck: number
  positioning: number
  rebound: number
  recovery: number
  puckhandling: number
  lowShots: number
  reflexes: number
  skating: number
  mentalToughness: number
  goalieStamina: number
}

type IndexPlayer = IndexSkaterAttributes &
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
 * transform an index player into trading card attributes and position
 * formulas found in the readme
 */
const calculateAttributesAndPosition = (
  player: IndexPlayer
): {
  skating: number
  shooting: number
  hands: number
  checking: number
  defense: number
  high_shots: number
  low_shots: number
  quickness: number
  control: number
  conditioning: number
  overall: number
  position: Position
} => {
  if (
    player.position === 'C' ||
    player.position === 'LW' ||
    player.position === 'RW'
  ) {
    const skating =
      (player.acceleration +
        player.agility +
        player.balance +
        player.speed +
        player.stamina) /
      5
    const shooting =
      (player.screening + player.gettingOpen + player.shootingAccuracy) / 3
    const hands =
      (player.passing + player.puckhandling + player.offensiveRead) / 3
    const checking = (player.checking + player.hitting + player.strength) / 3
    const defense =
      (player.positioning + player.stickchecking + player.defensiveRead) / 3
    const overall = skating + shooting + hands + checking + defense + 2

    return {
      overall,
      skating,
      shooting,
      hands,
      checking,
      defense,
      high_shots: null,
      low_shots: null,
      quickness: null,
      control: null,
      conditioning: null,
      position: 'F',
    }
  }

  if (player.position === 'LD' || player.position === 'RD') {
    const skating =
      (player.acceleration +
        player.agility +
        player.balance +
        player.speed +
        player.stamina) /
      5
    const shooting = (player.shootingRange + player.gettingOpen) / 2
    const hands =
      (player.passing + player.puckhandling + player.offensiveRead) / 3
    const checking = (player.checking + player.hitting + player.strength) / 3
    const defense =
      (player.positioning +
        player.stickchecking +
        player.shotBlocking +
        player.defensiveRead) /
      4
    const overall = skating + shooting + hands + checking + defense + 2

    return {
      overall,
      skating,
      shooting,
      hands,
      checking,
      defense,
      high_shots: null,
      low_shots: null,
      quickness: null,
      control: null,
      conditioning: null,
      position: 'D',
    }
  }

  if (player.position === 'G') {
    const high_shots = (player.blocker + player.glove) / 2
    const low_shots = (player.lowShots + player.pokeCheck) / 2
    const quickness = (player.positioning + player.rebound) / 2
    const control =
      (player.goalieStamina + player.mentalToughness + player.recovery) / 3
    const conditioning = (player.recovery + player.puckhandling) / 2
    const overall =
      high_shots + low_shots + quickness + conditioning + conditioning

    return {
      skating: null,
      shooting: null,
      hands: null,
      checking: null,
      defense: null,
      high_shots,
      low_shots,
      quickness,
      control,
      conditioning,
      overall,
      position: 'G',
    }
  }
}

/**
 * calculate a card's rarity
 */
const calculateRarity = (position: Position, overall: number): string => {
  if (position === 'F' || position === 'D') {
    if (overall < 70) return rarityMap.bronze.value
    if (overall >= 70 && overall < 80) return rarityMap.silver.value
    if (overall >= 80 && overall < 85) return rarityMap.gold.value
    if (overall >= 85 && overall < 88) return rarityMap.ruby.value
    if (overall >= 88) return rarityMap.diamond.value
    return rarityMap.bronze.label
  } else {
    if (overall < 76) return rarityMap.bronze.value
    if (overall >= 76 && overall < 81) return rarityMap.silver.value
    if (overall >= 81 && overall < 86) return rarityMap.gold.value
    if (overall >= 86 && overall < 89) return rarityMap.ruby.value
    if (overall >= 89) return rarityMap.diamond.value
    return rarityMap.bronze.label
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
      // const calculatedPlayerData = calculatePlayerRequestData(player)
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
      const playerResult = await queryDatabase(
        SQL`
        SELECT count(*) as amount
        FROM admin_cards.cards 
        WHERE playerId=${player.id}
          AND teamId=${player.team}
          AND player_name=${player.name}
          AND card_rarity=${rarity};`
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
