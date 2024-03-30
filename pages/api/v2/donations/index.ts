import { POST } from '@constants/http-methods'
import {
  getCardsDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { StatusCodes } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'
import SQL from 'sql-template-strings'

const allowedMethods = [POST]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { body, method } = request
  const { uid, subscription } = body

  if (method === POST) {
    const result = await queryDatabase(
      SQL`
      UPDATE `.append(getCardsDatabaseName()).append(SQL`.cards
      SET subscription = ${subscription}
      WHERE uid = ${uid};
      `)
    )

    response.status(StatusCodes.OK).json(result)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
