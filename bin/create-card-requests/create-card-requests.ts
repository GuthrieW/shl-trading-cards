#!/usr/bin/env node
import {
  getCardsDatabaseName,
  queryDatabase,
} from '../../pages/api/database/database'
import { ArgumentParser } from 'argparse'
import axios, { AxiosResponse } from 'axios'
import SQL, { SQLStatement } from 'sql-template-strings'
import {
  calculateAttributesAndPosition,
  calculateRarity,
  getSameAndHigherRaritiesQueryFragment,
  teamNameToId,
} from './create-card-requests.utils'
import { GET } from '../../constants/http-methods'
import {
  ImportError,
  IndexPlayer,
  PortalPlayer,
} from './create-card-requests.d'
import { writeFileSync } from 'fs'
import { isNil } from 'lodash'

let parser = new ArgumentParser()
let unfoundPlayerCount = 0

parser.add_argument('--season', {
  type: Number,
  required: true,
})

parser.add_argument('--prodRun', {
  action: 'store_true',
  default: false,
})

let args: {
  season: number
  prodRun?: boolean
} = parser.parse_args()

void main()
  .then(async () => {
    console.log('Finished creating card requests')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(2)
  })

async function main() {
  console.log('args', args)
  if (!args.season) throw new Error('argument --season number required')

  const skaters: IndexPlayer[] = await getIndexSkaters(args.season)
  const goalies: IndexPlayer[] = await getIndexGoalies(args.season)
  const portalPlayers: PortalPlayer[] = await getPortalPlayers()
  const skatersWithSeason: IndexPlayer[] = addSeasonToPlayers(
    skaters,
    portalPlayers
  )
  const goaliesWithSeason: IndexPlayer[] = addSeasonToPlayers(
    goalies,
    portalPlayers
  )

  console.log('unfound player count: ', unfoundPlayerCount)
  const cardRequests: CardRequest[] =
    await checkForDuplicatesAndCreateCardRequestData([
      ...skatersWithSeason,
      ...goaliesWithSeason,
    ])
  await writeFileSync('temp/card-requests.txt', JSON.stringify(cardRequests))
  requestCards(cardRequests, args.prodRun)
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
 * get player data from the portal API for a season
 */
async function getPortalPlayers(): Promise<PortalPlayer[]> {
  const players: AxiosResponse<PortalPlayer[], any> = await axios({
    method: GET,
    url: `https://portal.simulationhockey.com/api/v1/history/draft?leagueID=0`,
  })
  if (players.status !== 200) throw new Error('Error fetching portal players')
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
) {
  return indexPlayers.map((indexPlayer) => {
    const matchingPortalPlayer = portalPlayers.find(
      (portalPlayer) => portalPlayer.playerName === indexPlayer.name
    )
    if (matchingPortalPlayer) {
      return { ...indexPlayer, season: matchingPortalPlayer.seasonID }
    } else {
      console.error(
        'Please manually enter season for index player with id: ',
        indexPlayer.id
      )
      unfoundPlayerCount++
      return indexPlayer
    }
  })
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

        const playerResult = (await queryDatabase(
          SQL`
            SELECT count(*) as amount
            FROM `.append(getCardsDatabaseName()).append(`.cards
            WHERE player_name="${player.name}"
              AND teamID=${teamId} 
              AND playerID=${player.id} 
              AND ${raritiesToCheck} 
              AND position='${position}';
          `)
        )) as { amount: number }

        if (playerResult[0] && playerResult[0].amount > 0) {
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

/**
 * send card requests to the trading cards database
 */
async function requestCards(
  cardRequests: CardRequest[],
  isProdRun: boolean
): Promise<any> {
  const cardRows = await Promise.all(
    await cardRequests.map(async (cardRequest: CardRequest) => {
      return `('${cardRequest.player_name}', ${cardRequest.teamID}, ${cardRequest.playerID}, '${cardRequest.card_rarity}', '${cardRequest.sub_type}', 0, 0, '${cardRequest.position}', ${cardRequest.overall}, ${cardRequest.high_shots}, ${cardRequest.low_shots}, ${cardRequest.quickness}, ${cardRequest.control}, ${cardRequest.conditioning}, ${cardRequest.skating}, ${cardRequest.shooting}, ${cardRequest.hands}, ${cardRequest.checking}, ${cardRequest.defense}, ${cardRequest.season}, 0)`
    })
  )

  const insertQuery: SQLStatement = SQL`
    INSERT INTO admin_cards.cards
      (player_name, teamID, playerID, card_rarity, sub_type, pullable, approved, position, overall, high_shots, low_shots, quickness, control, conditioning, skating, shooting, hands, checking, defense, season, author_paid)
    VALUES
    ${cardRows.join(',\n')};
  `

  if (!isProdRun) {
    console.log(JSON.stringify(insertQuery, null, 2))
    console.log('Number of cards to insert', cardRows.length)

    return 'Dry run finished'
  }

  console.log(`Created ${cardRows.length} rows`)

  const result = await queryDatabase(insertQuery)
  return result
}
