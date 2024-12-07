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

const index = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ListResponse<TradeCard>>>
): Promise<void> => {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const uid = req.query.uid as string
    const cardID = req.query.cardID as string

    if (!cardID) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'no card ID, query cannot work',
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
      WHERE collectionCard.userID=${uid} and collectionCard.cardID=${cardID} LIMIT 1
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
        card.conditioning
      FROM collection collectionCard
      LEFT JOIN cards card
        ON card.cardID=collectionCard.cardID
      LEFT JOIN team_data team
        ON card.teamID=team.teamID
      WHERE collectionCard.userID=${uid}  and collectionCard.cardID=${cardID}  LIMIT 1
    `

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

export default index