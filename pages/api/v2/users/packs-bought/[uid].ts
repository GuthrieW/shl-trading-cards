import middleware from '@pages/api/database/middleware'
import { NextApiRequest, NextApiResponse } from 'next'
import { GET } from '@constants/http-methods'
import Cors from 'cors'
import SQL from 'sql-template-strings'
import {
  getCardsDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
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
  const { method, query } = request

  if (method === GET) {
    const { uid } = query

    const result = await queryDatabase(
      SQL`
      SELECT packsToday
      FROM `.append(getCardsDatabaseName()).append(SQL`.packToday
      WHERE userID=${uid};
    `)
    )

    response.status(StatusCodes.OK).json(result[0]?.packsToday)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
