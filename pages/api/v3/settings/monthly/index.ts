import { GET } from '@constants/http-methods'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, ListResponse, ListTotal } from '../..'
import { cardsQuery } from '@pages/api/database/database'
import SQL, { SQLStatement } from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import methodNotAllowed from '../../lib/methodNotAllowed'

const allowedMethods: string[] = [GET] as const
const cors = Cors({
  methods: allowedMethods,
})

export type MonthlySettingsData = {
  uid: number
  username: string
  subscription: number
}

export default async function settingsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ListResponse<MonthlySettingsData>>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const username: string = (req.query.username ?? '') as string
    const limit: string = (req.query.limit ?? 10) as string
    const offset: string = (req.query.offset ?? 0) as string
    const sortColumn: string = (req.query.sortColumn ?? 'username') as string
    const sortDirection: string = (req.query.sortDirection ?? 'ASC') as string

    const countQuery: SQLStatement = SQL`
      SELECT count(*) as total
      FROM admin_cards.monthly_subscriptions s
      LEFT JOIN admin_mybb.mybb_users u ON s.userID = u.uid
      WHERE subscription > 0
    `

    const query: SQLStatement = SQL`
      SELECT u.uid, u.username, s.subscription 
      FROM admin_cards.monthly_subscriptions s
      LEFT JOIN admin_mybb.mybb_users u ON s.userID = u.uid
      WHERE s.subscription > 0
    `

    if (username) {
      countQuery.append(SQL` AND u.username LIKE ${`%${username}%`}`)
      query.append(SQL` AND u.username LIKE ${`%${username}%`}`)
    }

    if (sortColumn) {
      query.append(SQL` ORDER BY`)
      if (sortColumn === 'username') {
        query.append(SQL` u.username`)
      }

      if (sortColumn === 'subscription') {
        query.append(SQL` s.subscription`)
      }

      sortDirection === 'ASC' ? query.append(SQL` ASC`) : query.append(` DESC`)
    }

    if (limit) {
      query.append(SQL` LIMIT ${parseInt(limit)}`)
    }

    if (offset) {
      query.append(SQL` OFFSET ${parseInt(offset)}`)
    }

    const countResult = await cardsQuery<ListTotal>(countQuery)
    const queryResult = await cardsQuery<MonthlySettingsData>(query)

    if ('error' in countResult) {
      console.error(countResult)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    if ('error' in queryResult) {
      console.error(queryResult)
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
