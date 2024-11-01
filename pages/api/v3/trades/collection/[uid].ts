import middleware from '@pages/api/database/middleware'
import { ApiResponse, ListResponse, ListTotal, SortDirection } from '../..'
import { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { GET } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import SQL, { SQLStatement } from 'sql-template-strings'
import { cardsQuery } from '@pages/api/database/database'
import methodNotAllowed from '../../lib/methodNotAllowed'

export type TradeCard = {
  cardID: number
  ownedCardID: number
  teamName: string
  teamNickName: string
  teamID: number
  player_name: string
  position: 'F' | 'D' | 'G'
  card_rarity: string
  season: number
  image_url: string
  overall: number
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
  playerID: number
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
    const teams = JSON.parse(req.query.teams as string) as string[]
    const rarities = JSON.parse(req.query.rarities as string) as string[]
    const limit = (req.query.limit ?? 10) as string
    const offset = (req.query.offset ?? 0) as string
    const sortColumn = (req.query.sortColumn ??
      'overall') as keyof Readonly<Card>
    const sortDirection = (req.query.sortDirection ?? 'DESC') as SortDirection

    if (!uid) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Please provide a uid in your request',
      })
      return
    }

    const countQuery: SQLStatement = SQL`
      SELECT count(*) as total
      FROM collection collectionCard
      LEFT JOIN cards card
        ON card.cardID=collectionCard.cardID
      LEFT JOIN team_data team
        ON card.teamID=team.teamID
      WHERE collectionCard.userID=${uid}
    `

    const query: SQLStatement = SQL`
      SELECT collectionCard.cardID,
        collectionCard.ownedCardID,
        team.Name as teamName,
        team.Nickname as teamNickName,
        card.teamID,
        card.player_name,
        card.position,
        card.card_rarity,
        card.season,
        card.image_url,
        card.overall,
        card.skating,
        card.shooting,
        card.hands,
        card.checking,
        card.defense,
        card.high_shots,
        card.low_shots,
        card.quickness,
        card.control,
        card.conditioning,
        card.playerID
      FROM collection collectionCard
      LEFT JOIN cards card
        ON card.cardID=collectionCard.cardID
      LEFT JOIN team_data team
        ON card.teamID=team.teamID
      WHERE collectionCard.userID=${uid}
    `

    if (playerName.length !== 0) {
      countQuery.append(SQL` AND card.player_name LIKE ${`%${playerName}%`}`)
      query.append(SQL` AND card.player_name LIKE ${`%${playerName}%`}`)
    }

    if (teams.length !== 0) {
      countQuery.append(SQL` AND (`)
      teams.forEach((team, index) =>
        index === 0
          ? countQuery.append(SQL`card.teamID=${parseInt(team)}`)
          : countQuery.append(SQL` OR card.teamID=${parseInt(team)}`)
      )
      countQuery.append(SQL`)`)

      query.append(SQL` AND (`)
      teams.forEach((team, index) =>
        index === 0
          ? query.append(SQL`card.teamID=${parseInt(team)}`)
          : query.append(SQL` OR card.teamID=${parseInt(team)}`)
      )
      query.append(SQL`)`)
    }

    if (rarities.length !== 0) {
      countQuery.append(SQL` AND (`)
      rarities.forEach((rarity, index) =>
        index === 0
          ? countQuery.append(SQL`card.card_rarity=${rarity}`)
          : countQuery.append(SQL` OR card.card_rarity=${rarity}`)
      )
      countQuery.append(SQL`)`)

      query.append(SQL` AND (`)
      rarities.forEach((rarity, index) =>
        index === 0
          ? query.append(SQL`card.card_rarity=${rarity}`)
          : query.append(SQL` OR card.card_rarity=${rarity}`)
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

    const countResult = await cardsQuery<ListTotal>(countQuery)

    if ('error' in countResult) {
      console.error(countResult.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    const queryResult = await cardsQuery<TradeCard>(query)

    if ('error' in queryResult) {
      console.error(queryResult.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: { rows: queryResult, total: countResult[0].total },
    })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
