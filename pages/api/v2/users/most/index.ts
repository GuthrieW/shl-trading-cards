import middleware from '@pages/api/database/middleware'
import { NextApiRequest, NextApiResponse } from 'next'
import { GET } from '@constants/http-methods'

import Cors from 'cors'
import { queryDatabase } from '@pages/api/database/database'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'

const allowedMethods = [GET]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method } = request

  if (method === GET) {
    const result = await queryDatabase(SQL`
      SELECT ownedCards.userID, count(*) AS uniqueCards, sum(ownedCards.quantity) AS sum, user_info.username, user_info.avatar
      FROM ownedCards
      LEFT JOIN user_info 
      ON ownedCards.userID = user_info.uid
      GROUP BY userID  
      ORDER BY sum(ownedCards.quantity) DESC
      LIMIT 10
    `)

    response.status(StatusCodes.OK).json(result)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
