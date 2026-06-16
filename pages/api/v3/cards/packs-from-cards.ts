import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, UserCollection } from '..'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { GET } from '@constants/http-methods'
import { cardsQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import methodNotAllowed from '../lib/methodNotAllowed'

const allowedMethods: string[] = [GET]
const cors = Cors({
  methods: allowedMethods,
})

export default async function userUniqueCardsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserCollection[] | null>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const userID = req.query.userID as string
    const cardID = req.query.cardID as string
    const isOwned = req.query.isOwned as string
    if (!userID || !cardID) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: 'error', message: 'Missing userID or cardID' })
      return
    }
    let query
    if (isOwned === 'true') {
      query = SQL`
            SELECT ownedCardID, userID, cardID, packID
            FROM collection
            WHERE userID = ${userID} AND cardID = ${cardID}
        `
    } else {
      query = SQL`
            SELECT c.cardID, c.userID, u.username, COUNT(c.cardID) AS total
FROM collection AS c
JOIN user_info AS u ON c.userID = u.uid
WHERE c.cardID = ${cardID}
GROUP BY c.userID, c.cardID, u.username
ORDER BY total DESC
        `
    }

    const queryResult = await cardsQuery<UserCollection>(query)

    if ('error' in queryResult) {
      console.error(queryResult.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Database connection failed')
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
