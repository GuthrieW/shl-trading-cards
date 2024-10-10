import middleware from '@pages/api/database/middleware'
import { NextApiRequest, NextApiResponse } from 'next'
import { GET } from '@constants/http-methods'

import Cors from 'cors'
import { cardsQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse, UserMostCards } from '..'

const allowedMethods = [GET]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserMostCards[] | null>>
): Promise<void> => {
  await middleware(request, res, cors)
  const { method } = request

  if (method === GET) {
    const queryResult = await cardsQuery<UserMostCards>(SQL`
      SELECT ownedCards.userID as userID, count(*) AS uniqueCards, sum(ownedCards.quantity) AS totalCards, user_info.username as username, user_info.avatar as avatar
      FROM ownedCards
      LEFT JOIN user_info 
      ON ownedCards.userID = user_info.uid
      GROUP BY userID  
      ORDER BY sum(ownedCards.quantity) DESC
      LIMIT 10
    `)

    if ('error' in queryResult) {
        console.error(queryResult.error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .end('Database connection failed');
        return;
      }
  
      if (queryResult.length === 0) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ status: 'error', message: 'No unique cards found' });
        return;
      }

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: queryResult,
    })

    res.setHeader('Allowed', allowedMethods)
    res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
  }
}
export default index
