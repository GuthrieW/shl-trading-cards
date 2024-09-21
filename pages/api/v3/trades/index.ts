import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, ListResponse } from '..'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { GET } from '@constants/http-methods'
import { cardsQuery, usersQuery } from '@pages/api/database/database'
import SQL, { SQLStatement } from 'sql-template-strings'
import { checkUserAuthorization } from '../lib/checkUserAuthorization'
import { StatusCodes } from 'http-status-codes'
import { UserData } from '../user'

const allowedMethods: string[] = [GET] as const
const cors = Cors({
  methods: allowedMethods,
})

export default async function tradesEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ListResponse<Trade>>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const username = (req.query.username ?? '') as string
    const status = (req.query.status ?? '') as string
    console.log('username', username, 'status', status)

    if (!(await checkUserAuthorization(req))) {
      res.status(StatusCodes.UNAUTHORIZED).end('Not authorized')
      return
    }

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

    console.log('tradePartners', tradePartners)

    const userId = req.cookies.userid
    const tradesQuery = SQL`SELECT * FROM trades`

    if (tradePartners.length === 0) {
      tradesQuery.append(
        SQL` WHERE (initiatorID=${userId} OR recipientID=${userId})`
      )
    } else {
      const partnerIds = tradePartners.map((partner) => partner.uid)
      tradesQuery.append(
        SQL` WHERE ((initiatorID=${userId} AND recipientID IN (`
      )
      partnerIds.forEach((id, index) => {
        if (index === 0) {
          tradesQuery.append(SQL` ${id}`)
          return
        }

        tradesQuery.append(SQL`, ${id}`)
      })
      tradesQuery.append(SQL`)) OR (recipientID=${userId} AND initiatorID IN (`)
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
      tradesQuery.append(SQL` AND trade_status=${status}`)
    }

    console.log('tradesQuery', tradesQuery)

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
}
