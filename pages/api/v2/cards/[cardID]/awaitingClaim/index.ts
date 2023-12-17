import middleware from '@pages/api/database/middleware'
import { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { PATCH } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import {
  getCardsDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import SQL from 'sql-template-strings'

const allowedMethods = [PATCH]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method, query, body } = request

  if (method === PATCH) {
    const { cardID } = query
    const result = await queryDatabase(
      SQL`UPDATE `.append(getCardsDatabaseName()).append(SQL`.cards
        SET image_url=NULL,
          pullable=0,
          approved=0,
          author_userID=NULL

        WHERE cardID=${cardID};`)
    )

    response.status(StatusCodes.OK).json(result)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
