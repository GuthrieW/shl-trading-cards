import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '..'
import middleware from '@pages/api/database/middleware'
import { GET, POST } from '@constants/http-methods'
import Cors from 'cors'
import methodNotAllowed from '../lib/methodNotAllowed'
import { StatusCodes } from 'http-status-codes'
import {
  ImportError,
  IndexPlayer,
  PortalPlayer,
  Position,
} from './card-requests'
import { rarityMap } from '@constants/rarity-map'
import { cardsQuery } from '@pages/api/database/database'
import SQL, { SQLStatement } from 'sql-template-strings'
import axios, { AxiosResponse } from 'axios'

const allowedMethods: string[] = [POST]
const cors = Cors({
  methods: allowedMethods,
})

export default async function baseRequestsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<
    ApiResponse<{ skaterErrors: string[]; goalieErrors: string[] }>
  >
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === POST) {
    const seasonString = req.body.season as string
    if (!seasonString || isNaN(seasonString as any)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .end('Please provide a valid season number in your request')
      return
    }

    const season = parseInt(seasonString)

    try {
      const skaters: IndexPlayer[] = await getIndexSkaters(season)
      const goalies: IndexPlayer[] = await getIndexGoalies(season)
      const portalPlayers: PortalPlayer[] = await getPortalPlayers()
      const { updatedPlayers: skatersWithSeason, errors: skaterErrors } =
        addSeasonToPlayers(skaters, portalPlayers)
      const { updatedPlayers: goaliesWithSeason, errors: goalieErrors } =
        addSeasonToPlayers(goalies, portalPlayers)

      const cardRequests: CardRequest[] =
        await checkForDuplicatesAndCreateCardRequestData([
          ...skatersWithSeason,
          ...goaliesWithSeason,
        ])
      await requestCards(cardRequests)

      res.status(StatusCodes.OK).json({
        status: 'success',
        payload: {
          skaterErrors,
          goalieErrors,
        },
      })
      return
    } catch (error) {
      console.error(error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(error)
      return
    }
  }

  methodNotAllowed(req, res, allowedMethods)
}

/**
 * get skaters from the index API for a season
 */
async function getIndexSkaters(season: number): Promise<IndexPlayer[]> {
  const players: AxiosResponse<IndexPlayer[], any> = await axios({
    method: GET,
    url: `https://index.simulationhockey.com/api/v1/players/ratings?season=${season}`,
  })
  if (players.status !== 200) {
    throw new Error('Error fetching skaters from index')
  }

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
  if (players.status !== 200) {
    throw new Error('Error fetching goalies from index')
  }
  return players.data
}

/**
 * get player data from the portal API for a season
 */
async function getPortalPlayers(): Promise<PortalPlayer[]> {
  const players: AxiosResponse<PortalPlayer[], any> = await axios({
    method: GET,
    url: `https://portal.simulationhockey.com/api/v1/history/draft?leagueID=0`,
  })
  if (players.status !== 200) {
    throw new Error('Error fetching players from portal')
  }
  return players.data
}

/**
 * add player season to index players from their matching portal name
 * if a match is not found the index player will be used as is in the import and the
 * correct season will have to be added to the player manually
 */
function addSeasonToPlayers(
  indexPlayers: IndexPlayer[],
  portalPlayers: PortalPlayer[]
): { updatedPlayers: IndexPlayer[]; errors: string[] } {
  const errors: string[] = []
  const updatedPlayers = indexPlayers.map((indexPlayer) => {
    const matchingPortalPlayer = portalPlayers.find(
      (portalPlayer) => portalPlayer.playerName === indexPlayer.name
    )
    if (matchingPortalPlayer) {
      return { ...indexPlayer, season: matchingPortalPlayer.seasonID }
    } else {
      const error = `Please manually enter season for index player with id and name: ${indexPlayer.id} ${indexPlayer.name}`
      console.error(error)
      errors.push(error)
      return indexPlayer
    }
  })

  return { updatedPlayers, errors }
}

/**
 * check if cards already exist with the same playerId, teamId, player_name and card_rarity
 */
async function checkForDuplicatesAndCreateCardRequestData(
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

        const playerResult = await cardsQuery<{
          count: number
        }>(
          SQL`
            SELECT count(*) as amount
            FROM cards
            WHERE player_name="${player.name}"
              AND teamID=${teamId} 
              AND playerID=${player.id} 
              AND ${raritiesToCheck} 
              AND position='${position}';
          `
        )

        if (playerResult[0] && playerResult[0].count > 0) {
          return null
        }

        return {
          teamID: teamId,
          playerID: Number(player.id),
          player_name: player.name,
          season: player.season,
          card_rarity: rarity,
          sub_type: null,
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
        } as CardRequest
      } catch (e) {
        console.log('error', e)
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

export async function requestCards(cardRequests: CardRequest[]): Promise<void> {
  await Promise.all(
    await cardRequests.map(async (cardRequest) => {
      const insertQuery: SQLStatement = SQL`
        INSERT INTO cards
          (player_name, teamID, playerID, card_rarity, sub_type, pullable, approved, position, overall, high_shots, low_shots, quickness, control, conditioning, skating, shooting, hands, checking, defense, season, author_paid)
        VALUES (${cardRequest.player_name.trim()}, ${cardRequest.teamID}, ${
          cardRequest.playerID
        }, ${cardRequest.card_rarity}, ${cardRequest.sub_type}, 0, 0, ${
          cardRequest.position
        }, ${cardRequest.overall}, ${cardRequest.high_shots}, ${
          cardRequest.low_shots
        }, ${cardRequest.quickness}, ${cardRequest.control}, ${
          cardRequest.conditioning
        }, ${cardRequest.skating}, ${cardRequest.shooting}, ${
          cardRequest.hands
        }, ${cardRequest.checking}, ${cardRequest.defense}, ${
          cardRequest.season
        }, 0);
      `

      return await cardsQuery(insertQuery)
    })
  )
  return
}

/**
 * transform an index player into trading card attributes and position
 * formulas found in the readme
 */
export const calculateAttributesAndPosition = (
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
    const skating: number = Math.ceil(
      (player.acceleration +
        player.agility +
        player.balance +
        player.speed +
        player.stamina) /
        5
    )
    const shooting: number = Math.ceil(
      (player.screening + player.gettingOpen + player.shootingAccuracy) / 3
    )
    const hands: number = Math.ceil(
      (player.passing + player.puckhandling + player.offensiveRead) / 3
    )
    const checking: number = Math.ceil(
      (player.checking + player.hitting + player.strength) / 3
    )
    const defense: number = Math.ceil(
      (player.positioning + player.stickchecking + player.defensiveRead) / 3
    )
    const overall: number = skating + shooting + hands + checking + defense + 2

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
    const skating: number = Math.ceil(
      (player.acceleration +
        player.agility +
        player.balance +
        player.speed +
        player.stamina) /
        5
    )
    const shooting: number = Math.ceil(
      (player.shootingRange + player.gettingOpen) / 2
    )
    const hands: number = Math.ceil(
      (player.passing + player.puckhandling + player.offensiveRead) / 3
    )
    const checking: number = Math.ceil(
      (player.checking + player.hitting + player.strength) / 3
    )
    const defense: number = Math.ceil(
      (player.positioning +
        player.stickchecking +
        player.shotBlocking +
        player.defensiveRead) /
        4
    )
    const overall: number = skating + shooting + hands + checking + defense + 2

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
    const high_shots: number = Math.ceil((player.blocker + player.glove) / 2)
    const low_shots: number = Math.ceil(
      (player.lowShots + player.pokeCheck) / 2
    )
    const quickness: number = Math.ceil((player.reflexes + player.skating) / 2)
    const control: number = Math.ceil(
      (player.puckhandling + player.rebound + player.positioning) / 3
    )
    const conditioning: number = Math.ceil(
      (player.recovery + player.mentalToughness + player.goalieStamina) / 3
    )
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
 *
 */
export const getSameAndHigherRaritiesQueryFragment = (
  rarity: string
): string => {
  if (rarity === rarityMap.bronze.value) {
    return `(card_rarity='${rarityMap.bronze.value}' OR card_rarity='${rarityMap.silver.value}' OR card_rarity='${rarityMap.gold.value}' OR card_rarity='${rarityMap.ruby.value}' OR card_rarity='${rarityMap.diamond.value}')`
  }
  if (rarity === rarityMap.silver.value) {
    return `(card_rarity='${rarityMap.silver.value}' OR card_rarity='${rarityMap.gold.value}' OR card_rarity='${rarityMap.ruby.value}' OR card_rarity='${rarityMap.diamond.value}')`
  }
  if (rarity === rarityMap.gold.value) {
    return `(card_rarity='${rarityMap.gold.value}' OR card_rarity='${rarityMap.ruby.value}' OR card_rarity='${rarityMap.diamond.value}')`
  }
  if (rarity === rarityMap.ruby.value) {
    return `(card_rarity='${rarityMap.ruby.value}' OR card_rarity='${rarityMap.diamond.value}')`
  }
  if (rarity === rarityMap.diamond.value) {
    return `(card_rarity='${rarityMap.diamond.value}')`
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
const teamNameToId = (teamName: string): number =>
  Object.values(portalTeamsMap).find((team) => team.abbreviation === teamName)
    ?.teamID

const portalTeamsMap: { teamID: number; abbreviation: string }[] = [
  { teamID: 0, abbreviation: 'BUF' },
  { teamID: 1, abbreviation: 'CHI' },
  { teamID: 2, abbreviation: 'HAM' },
  { teamID: 3, abbreviation: 'TOR' },
  { teamID: 4, abbreviation: 'MAN' },
  { teamID: 5, abbreviation: 'NEW' },
  { teamID: 6, abbreviation: 'TBB' },
  { teamID: 7, abbreviation: 'BAP' },
  { teamID: 7, abbreviation: 'WKP' },
  { teamID: 8, abbreviation: 'CGY' },
  { teamID: 9, abbreviation: 'EDM' },
  { teamID: 10, abbreviation: 'MIN' },
  { teamID: 11, abbreviation: 'WPG' },
  { teamID: 12, abbreviation: 'SFP' },
  { teamID: 13, abbreviation: 'LAP' },
  { teamID: 14, abbreviation: 'NOL' },
  { teamID: 15, abbreviation: 'TEX' },
  { teamID: 18, abbreviation: 'ATL' },
  { teamID: 19, abbreviation: 'SEA' },
  { teamID: 20, abbreviation: 'MTL' },
  { teamID: 21, abbreviation: 'PHI' },
]
