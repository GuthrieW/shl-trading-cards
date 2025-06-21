import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, ListResponse } from '..'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { GET, POST } from '@constants/http-methods'
import { cardsQuery, usersQuery } from '@pages/api/database/database'
import SQL, { SQLStatement } from 'sql-template-strings'
import { checkUserAuthorization } from '../lib/checkUserAuthorization'
import { StatusCodes } from 'http-status-codes'
import { UserData } from '../user'
import methodNotAllowed from '../lib/methodNotAllowed'
import { TradeAsset } from '@pages/api/mutations/use-create-trade'

const allowedMethods: string[] = [GET, POST] as const
const cors = Cors({
  methods: allowedMethods,
})

export default async function tradesEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ListResponse<Trade | null>>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const username = (req.query.username ?? '') as string
    const status = (req.query.status ?? '') as string

    let tradePartners = []
    if (username.length !== 0) {
      const partnerUserQuery: SQLStatement = SQL` SELECT uid, username FROM mybb_users`

      partnerUserQuery.append(SQL` WHERE username LIKE ${`%${username}%`}`)

      const partnerUserQueryResult =
        await usersQuery<UserData>(partnerUserQuery)

      if ('error' in partnerUserQueryResult) {
        console.error(partnerUserQueryResult.error)
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .end('Datebase connection failed')
        return
      }

      tradePartners = partnerUserQueryResult
    }

    const userId = req.cookies.userid
    const tradesQuery = SQL`  SELECT 
    t.tradeID,
    t.initiatorID,
    initiator.username AS initiatorUsername,
    t.recipientID,
    recipient.username AS recipientUsername,
    t.trade_status,
    t.create_date,
    t.update_date,
    t.declineUserID
  FROM trades AS t
  INNER JOIN user_info AS initiator ON initiator.uid = t.initiatorID
  INNER JOIN user_info AS recipient ON recipient.uid = t.recipientID`

    if (tradePartners.length === 0) {
      tradesQuery.append(
        SQL` WHERE (t.initiatorID=${userId} OR t.recipientID=${userId})`
      )
    } else {
      const partnerIds = tradePartners.map((partner) => partner.uid)
      tradesQuery.append(
        SQL` WHERE ((t.initiatorID=${userId} AND t.recipientID IN (`
      )
      partnerIds.forEach((id, index) => {
        if (index === 0) {
          tradesQuery.append(SQL` ${id}`)
          return
        }

        tradesQuery.append(SQL`, ${id}`)
      })
      tradesQuery.append(
        SQL`)) OR (t.recipientID=${userId} AND t.initiatorID IN (`
      )
      partnerIds.forEach((id, index) => {
        if (index === 0) {
          tradesQuery.append(SQL` ${id}`)
          return
        }

        tradesQuery.append(SQL`, ${id}`)
      })
      tradesQuery.append(SQL`)))`)
    }

    if (status.length !== 0) {
      tradesQuery.append(
        SQL` AND t.trade_status=${status} ORDER BY t.create_date DESC`
      )
    }

    const queryResult = await cardsQuery<Trade>(tradesQuery)

    if ('error' in queryResult) {
      console.error(queryResult.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Datebase connection failed')
      return
    }
    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: {
        // @ts-ignore this is different because we called a procedure instead of a select
        rows: queryResult,
        // @ts-ignore this is different because we called a procedure instead of a select
        total: queryResult.length,
      },
    })
  }

  if (req.method === POST) {
    const initiatorId = req.body.initiatorId as string
    const recipientId = req.body.recipientId as string
    const tradeAssets = req.body.tradeAssets as TradeAsset[]

    if (
      !initiatorId ||
      !recipientId ||
      !tradeAssets ||
      tradeAssets.length === 0
    ) {
      res.status(StatusCodes.BAD_REQUEST).end('Malformed request')
      return
    }

    if (initiatorId === recipientId) {
      res.status(StatusCodes.BAD_REQUEST).end('You cannot trade with yourself')
      return
    }

    let tradeError: boolean = false
    await Promise.all(
      tradeAssets.map(async (asset: TradeAsset) => {
        const cardOwner = await cardsQuery<{ userID: string }>(
          SQL`SELECT userID FROM collection WHERE ownedCardId=${asset.ownedCardId} LIMIT 1`
        )
        if (cardOwner[0].userID != asset.fromId) {
          tradeError = true
        }
      })
    )

    if (tradeError) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end('Trade contains errors')
      return
    }

    const createTradeResult = await cardsQuery(
      SQL`CALL create_trade(${initiatorId},${recipientId})`
    )

    const newTrade = createTradeResult[0][0]

    await Promise.all(
      tradeAssets.map(
        async (asset: TradeAsset) =>
          await cardsQuery(
            SQL`CALL add_trade_asset(${newTrade.tradeID}, ${asset.ownedCardId}, ${asset.toId}, ${asset.fromId});`
          )
      )
    )

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: null,
    })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
