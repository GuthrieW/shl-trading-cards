import { GET } from '@constants/http-methods'
import {
  getCardsDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { StatusCodes } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'
import SQL from 'sql-template-strings'

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
    const result = await queryDatabase<Donator>(
      SQL`
        SELECT uid, subscription
        FROM `.append(getCardsDatabaseName()).append(SQL`.monthly_subscriptions 
        WHERE uid=${uid};
      `)
    )

    response.status(StatusCodes.OK).json(result)
    return
  }
  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
