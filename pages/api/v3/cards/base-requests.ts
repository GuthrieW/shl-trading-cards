import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '..'
import middleware from '@pages/api/database/middleware'
import { GET, POST } from '@constants/http-methods'
import Cors from 'cors'
import methodNotAllowed from '../lib/methodNotAllowed'
import { StatusCodes } from 'http-status-codes'
import { IndexPlayer, PortalPlayer, Position } from './card-requests'
import { rarityMap } from '@constants/rarity-map'
import { cardsQuery } from '@pages/api/database/database'
import SQL, { SQLStatement } from 'sql-template-strings'
import axios, { AxiosResponse } from 'axios'

export type BaseRequest = {
  playerID: string
  playerName: string
  teamID: string
  rarity: string
  season: number
  created: boolean
  needsSeason: boolean
  error?: string
}

const allowedMethods: string[] = [POST]
const cors = Cors({
  methods: allowedMethods,
})

export default async function baseRequestsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<
    ApiResponse<{
      created: BaseRequest[]
      duplicates: BaseRequest[]
      errors: BaseRequest[]
      hasInvalidSeason: BaseRequest[]
    }>
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

      const {
        updatedPlayers: skatersWithSeason,
        missingSeason: skatersMissingSeason,
      } = addSeasonToPlayers(skaters, portalPlayers)
      const {
        updatedPlayers: goaliesWithSeason,
        missingSeason: goaliesMissingSeason,
      } = addSeasonToPlayers(goalies, portalPlayers)

      const { cardRequests, duplicates, errors } =
        await checkForDuplicatesAndCreateCardRequestData([
          ...skatersWithSeason,
          ...goaliesWithSeason,
        ])

      await requestCards(cardRequests)

      const created = cardRequests.map(
        (cardRequest): BaseRequest => ({
          playerID: cardRequest.playerID?.toString(),
          playerName: cardRequest.player_name,
          teamID: cardRequest.teamID?.toString(),
          rarity: cardRequest.card_rarity,
          season: cardRequest.season,
          created: true,
          needsSeason: [...skatersMissingSeason, ...goaliesMissingSeason].some(
            (playerMissingSeason) =>
              playerMissingSeason.id === cardRequest.playerID?.toString()
          ),
          error: null,
        })
      )

      //creating return if cardRequests season is -1
      const hasInvalidSeason = created.filter(
        (request) => request.season === -1
      )

      res.status(StatusCodes.OK).json({
        status: 'success',
        payload: { created, duplicates, errors, hasInvalidSeason },
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
    url: `https://portal.simulationhockey.com/api/v1/player`,
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
): {
  updatedPlayers: IndexPlayer[]
  missingSeason: IndexPlayer[]
} {
  const missingSeason: IndexPlayer[] = []

  const updatedPlayers = indexPlayers.map((indexPlayer) => {
    const matchingPortalPlayer = portalPlayers.find(
      (portalPlayer) =>
        portalPlayer.indexRecords?.some(
          (indexRecord) =>
            indexRecord.indexID === Number(indexPlayer.id) &&
            indexRecord.leagueID === 0
        )
    )

    if (matchingPortalPlayer) {
      indexPlayer.name = matchingPortalPlayer.name // Use the portal name for the fancy letters
      return { ...indexPlayer, season: matchingPortalPlayer.draftSeason }
    } else {
      missingSeason.push(indexPlayer)
      return { ...indexPlayer, season: -1 }
    }
  })

  return { updatedPlayers, missingSeason }
}

/**
 * check if cards already exist with the same playerId, teamId, player_name and card_rarity
 */
async function checkForDuplicatesAndCreateCardRequestData(
  players: IndexPlayer[]
): Promise<{
  cardRequests: CardRequest[]
  duplicates: BaseRequest[]
  errors: BaseRequest[]
}> {
  const cardRequests: CardRequest[] = []
  const duplicates: BaseRequest[] = []
  const errors: BaseRequest[] = []
  await Promise.all(
    players.map(async (player: IndexPlayer, index) => {
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

        const query = SQL`
        SELECT count(*) as amount
        FROM cards
        WHERE player_name=${player.name}
          AND teamID=${teamId} 
          AND playerID=${player.id} 
          AND position=${position}
          
      `
        raritiesToCheck.forEach((rarity, index) => {
          if (index === 0) {
            query.append(SQL` AND (card_rarity=${rarity}`)
          } else {
            query.append(SQL` OR card_rarity=${rarity}`)
          }
        })
        query.append(');')

        const playerResult = await cardsQuery<{ amount: number }>(query)

        if (playerResult[0] && playerResult[0].amount > 0) {
          const duplicate = {
            cardID: null,
            playerID: player.id,
            playerName: player.name,
            teamID: player.team,
            rarity: rarity,
            season: player.season,
            created: false,
            needsSeason: false,
            error: 'Duplicate',
          } as BaseRequest
          duplicates.push(duplicate)
          return
        } else {
          const cardRequest = {
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
          cardRequests.push(cardRequest)
          return
        }
      } catch (e) {
        errors.push({
          playerID: player.id,
          playerName: player.name,
          teamID: player.team,
          rarity: null,
          season: player.season,
          created: false,
          needsSeason: false,
          error: e,
        })
        return
      }
    })
  )

  return {
    cardRequests,
    duplicates,
    errors,
  }
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
    const overall = high_shots + low_shots + quickness + control + conditioning

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
): string[] => {
  if (rarity === rarityMap.bronze.label) {
    return [
      rarityMap.bronze.label,
      rarityMap.silver.label,
      rarityMap.gold.label,
      rarityMap.ruby.label,
      rarityMap.diamond.label,
    ]
  }
  if (rarity === rarityMap.silver.label) {
    return [
      rarityMap.silver.label,
      rarityMap.gold.label,
      rarityMap.ruby.label,
      rarityMap.diamond.label,
    ]
  }
  if (rarity === rarityMap.gold.label) {
    return [rarityMap.gold.label, rarityMap.ruby.label, rarityMap.diamond.label]
  }
  if (rarity === rarityMap.ruby.label) {
    return [rarityMap.ruby.label, rarityMap.diamond.label]
  }
  if (rarity === rarityMap.diamond.label) {
    return [rarityMap.diamond.label]
  }
}

/**
 * calculate a card's rarity
 */
const calculateRarity = (position: Position, overall: number): string => {
  if (position === 'F' || position === 'D') {
    if (overall < 70) return rarityMap.bronze.label
    if (overall >= 70 && overall < 80) return rarityMap.silver.label
    if (overall >= 80 && overall < 85) return rarityMap.gold.label
    if (overall >= 85 && overall < 88) return rarityMap.ruby.label
    if (overall >= 88) return rarityMap.diamond.label
    return rarityMap.bronze.label
  } else {
    if (overall < 76) return rarityMap.bronze.label
    if (overall >= 76 && overall < 81) return rarityMap.silver.label
    if (overall >= 81 && overall < 86) return rarityMap.gold.label
    if (overall >= 86 && overall < 89) return rarityMap.ruby.label
    if (overall >= 89) return rarityMap.diamond.label
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
