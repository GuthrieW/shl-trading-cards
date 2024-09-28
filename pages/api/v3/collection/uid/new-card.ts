import { NextApiRequest, NextApiResponse } from 'next'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { GET } from '@constants/http-methods'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import methodNotAllowed from '../../lib/methodNotAllowed'
import { ApiResponse, UserPacks } from '../..'
import { cardsQuery } from '@pages/api/database/database'

const allowedMethods: string[] = [GET]
const cors = Cors({
  methods: allowedMethods,
})

export default async function userPacksEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<NewCard>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const userID = req.query.userID as string
    const cardID = req.query.cardID as string

    if (!userID && !cardID) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: 'error', message: 'Missing userID or cardID' })
      return
    }

    const query = SQL`
            SELECT COUNT(*) as quantity FROM collection where 1 
        `

    if (userID) {
      query.append(SQL` AND userID = ${userID}`)
    }

    if (cardID) {
      query.append(SQL` AND cardID = ${cardID}`)
    }

    const queryResult = await cardsQuery<NewCard>(query)
    if ('error' in queryResult) {
      console.error(queryResult.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Database connection failed')
      return
    }

    const [firstResult] = queryResult

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: firstResult,
    })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
