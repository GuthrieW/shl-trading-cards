import { GET } from '@constants/http-methods'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, ListResponse, ListTotal } from '../..'
import { cardsQuery } from '@pages/api/database/database'
import SQL, { SQLStatement } from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import methodNotAllowed from '../../lib/methodNotAllowed'
import { rateLimit } from 'lib/rateLimit'

const allowedMethods: string[] = [GET] as const
const cors = Cors({
  methods: allowedMethods,
})

export type DailySettingsData = {
  uid: number
  subscription: number
  rubySubscription: number
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<DailySettingsData[]>>
) => {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const userIDParam = req.query.userID
    let userID: number | null = null

    if (typeof userIDParam === 'string') {
      userID = parseInt(userIDParam, 10)
    }

    if (userID && isNaN(userID)) {
      res.status(StatusCodes.BAD_REQUEST).end('Invalid userID')
      return
    }

    const query: SQLStatement = SQL`
        SELECT s.userID as userID, s.subscription as subscription, s.rubySubscription as rubySubscription
        FROM settings s 
      `

    if (userID) {
      query.append(SQL` WHERE s.userID = ${userID} `)
    }

    const queryResult = await cardsQuery<DailySettingsData>(query)

    if ('error' in queryResult) {
      console.error(queryResult)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: queryResult,
    })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
export default rateLimit(handler)
