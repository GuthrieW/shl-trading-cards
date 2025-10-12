import middleware from '@pages/api/database/middleware'
import { ApiResponse, ListResponse, ListTotal, SortDirection } from '../..'
import { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { GET } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import SQL, { SQLStatement } from 'sql-template-strings'
import { cardsQuery } from '@pages/api/database/database'
import methodNotAllowed from '../../lib/methodNotAllowed'
import { parseQueryArray } from '@utils/parse-query-array'

export type TradeCard = {
  cardID: number
  ownedCardID: number
  teamID: number
  player_name: string
  card_rarity: string
  image_url: string
  overall: number
  total: number
}

export type TradeCardSortValue = keyof TradeCard
export type TradeCardSortOption = {
  value: keyof TradeCard
  label: string
  sortLabel: (direction: SortDirection) => string
}

const allowedMethods: string[] = [GET] as const
const cors = Cors({
  methods: allowedMethods,
})

export default async function tradeCollectionEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ListResponse<TradeCard>>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const uid = req.query.uid as string
    const playerName = req.query.playerName as string

    const limit = (req.query.limit ?? 10) as string
    const offset = (req.query.offset ?? 0) as string
    const sortColumn = (req.query.sortColumn ??
      'overall') as keyof Readonly<Card>
    const sortDirection = (req.query.sortDirection ?? 'DESC') as SortDirection
    const otherUID = req.query.otherUID as string
    const removeSingles = req.query.removeSingles as string
    const leagueID = req.query.leagueID as string

    const leagues = parseQueryArray(req.query.leagueID)
    const teams = parseQueryArray(req.query.teams)
    const rarities = parseQueryArray(req.query.rarities)
    const subType = parseQueryArray(req.query.subType)

    if (!uid) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Please provide a uid in your request',
      })
      return
    }

    const query: SQLStatement = SQL`
      SELECT collectionCard.cardID,
       collectionCard.ownedCardID,
       card.teamID,
       card.player_name,
       card.card_rarity,
       card.season,
       card.image_url,
       card.overall,
       COUNT(*) OVER() AS total
      FROM collection collectionCard`

    if (removeSingles === 'true') {
      query.append(SQL`
          JOIN (
            SELECT cardID
            FROM collection
            WHERE userID = ${uid}
            GROUP BY cardID
            HAVING COUNT(*) > 1
          ) dupes ON collectionCard.cardID = dupes.cardID
        `)
    }
    query.append(SQL`
      LEFT JOIN cards card
        ON card.cardID=collectionCard.cardID
        WHERE collectionCard.userID=${uid}`)

    if (leagues.length === 1) {
      query.append(SQL` AND card.leagueID = ${parseInt(leagues[0])}`)
    }

    if (playerName.length !== 0) {
      query.append(SQL` AND card.player_name LIKE ${`%${playerName}%`}`)
    }

    if (teams.length !== 0) {
      query.append(SQL` AND (`)
      teams.forEach((team, index) => {
        const [teamLeagueID, teamID] = team.split('-')
        if (index === 0) {
          query.append(
            SQL`(card.teamID=${parseInt(teamID)} AND card.leagueID=${parseInt(
              teamLeagueID
            )})`
          )
        } else {
          query.append(
            SQL` OR (card.teamID=${parseInt(
              teamID
            )} AND card.leagueID=${parseInt(teamLeagueID)})`
          )
        }
      })
      query.append(SQL`)`)
    }

    if (otherUID) {
      query.append(
        SQL` AND card.cardID NOT IN (
            SELECT cardID 
            FROM ownedCards 
            WHERE userID =${parseInt(otherUID)} )`
      )
    }

    if (rarities.length !== 0) {
      query.append(SQL` AND (`)
      rarities.forEach((rarity, index) =>
        index === 0
          ? query.append(SQL`card.card_rarity=${rarity}`)
          : query.append(SQL` OR card.card_rarity=${rarity}`)
      )
      query.append(SQL`)`)
    }

    if (subType.length !== 0) {
      query.append(SQL` AND (`)
      subType.forEach((sub_type, index) =>
        index === 0
          ? query.append(SQL`card.sub_type=${sub_type}`)
          : query.append(SQL` OR card.sub_type=${sub_type}`)
      )
      query.append(SQL`)`)
    }

    query.append(SQL` ORDER BY`)
    if (sortColumn === 'overall') {
      query.append(SQL` card.overall`)
      sortDirection === 'ASC'
        ? query.append(SQL` ASC`)
        : query.append(SQL` DESC`)
    }

    if (sortColumn === 'player_name') {
      query.append(SQL` card.player_name`)
      sortDirection === 'DESC'
        ? query.append(SQL` ASC`)
        : query.append(SQL` DESC`)
      query.append(SQL`, card.overall DESC`)
    }

    if (sortColumn === 'teamID') {
      query.append(SQL` team.Name`)
      sortDirection === 'DESC'
        ? query.append(SQL` ASC`)
        : query.append(SQL` DESC`)
      query.append(SQL`, card.overall DESC`)
    }

    if (limit) {
      query.append(SQL` LIMIT ${parseInt(limit)}`)
    }

    if (offset) {
      query.append(SQL` OFFSET ${parseInt(offset)}`)
    }
    const queryResult = await cardsQuery<TradeCard>(query)

    if ('error' in queryResult) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    const total = queryResult.length > 0 ? queryResult[0].total : 0

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: { rows: queryResult, total: total },
    })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
