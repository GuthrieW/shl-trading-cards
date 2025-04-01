import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, ListResponse, ListTotal } from '..'
import { UserData } from '.'
import middleware from '@pages/api/database/middleware'
import { GET } from '@constants/http-methods'
import Cors from 'cors'
import SQL, { SQLStatement } from 'sql-template-strings'
import { cardsQuery } from '@pages/api/database/database'
import methodNotAllowed from '../lib/methodNotAllowed'
import { StatusCodes } from 'http-status-codes'
import { checkUserAuthorization } from '../lib/checkUserAuthorization'
import { rateLimit } from 'lib/rateLimit'

const allowedMethods = [GET]
const cors = Cors({
  methods: allowedMethods,
})

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ListResponse<UserData>>>
) => {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const username = req.query.username as string
    const limit = parseInt(req.query.limit as string, 10) || 10
    const offset = parseInt(req.query.offset as string, 10) || 0

    const isAuthenticated: boolean = await checkUserAuthorization(req)

    const countQuery: SQLStatement = SQL`
      SELECT count(*) as total
      FROM user_info u
      WHERE`

    const query: SQLStatement = SQL`
      SELECT 
        u.uid, 
        u.username,
        u.avatar
      FROM user_info u
      WHERE`

    if (username) {
      countQuery.append(SQL` u.username LIKE ${`%${username}%`} AND`)
      query.append(SQL` u.username LIKE ${`%${username}%`} AND`)
    }

    if (isAuthenticated) {
      const userid = req.cookies.userid
      countQuery.append(SQL` u.uid !=${userid} AND`)
      query.append(SQL` u.uid !=${userid} AND`)
    }

    countQuery.append(SQL` u.uid IN
      (SELECT DISTINCT userID FROM collection)
      ORDER BY username ASC
    `)

    query.append(SQL` u.uid IN
      (SELECT DISTINCT userID FROM collection)
      ORDER BY username ASC
      LIMIT ${limit}
      OFFSET ${offset}
    `)

    const countResult = await cardsQuery<ListTotal>(countQuery)
    const queryResult = await cardsQuery<UserData>(query)

    if ('error' in countResult) {
      console.error(countResult.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Database connection failed')
      return
    }

    if ('error' in queryResult) {
      console.error(queryResult.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Database connection failed')
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
export default rateLimit(handler)
