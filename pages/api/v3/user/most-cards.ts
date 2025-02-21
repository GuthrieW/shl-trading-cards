import middleware from '@pages/api/database/middleware'
import { NextApiRequest, NextApiResponse } from 'next'
import { GET } from '@constants/http-methods'

import Cors from 'cors'
import { cardsQuery } from '@pages/api/database/database'
import SQL, { SQLStatement } from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse, UserMostCards } from '..'
import { rateLimit } from 'lib/rateLimit'

const allowedMethods = [GET]
const cors = Cors({
  methods: allowedMethods,
})

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserMostCards[] | null>>
): Promise<void> => {
  await middleware(req, res, cors)
  const { method } = req

  if (method === GET) {
    const limit = req.query.limit as string
    const queryString: SQLStatement = SQL`
      SELECT ownedCards.userID as userID, count(*) AS uniqueCards, sum(ownedCards.quantity) AS totalCards, user_info.username as username, user_info.avatar as avatar
      FROM ownedCards
      LEFT JOIN user_info 
      ON ownedCards.userID = user_info.uid
      GROUP BY userID  
      ORDER BY sum(ownedCards.quantity) DESC
       `
    if (limit) {
      queryString.append(SQL` LIMIT ${limit}`)
    }
    const queryResult = await cardsQuery<UserMostCards>(queryString)

    if ('error' in queryResult) {
      console.error(queryResult.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Database connection failed')
      return
    }

    if (queryResult.length === 0) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: 'error', message: 'No unique cards found' })
      return
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: queryResult,
    })

    res.setHeader('Allowed', allowedMethods)
    res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
  }
}
export default rateLimit(handler)
