import { NextApiRequest, NextApiResponse } from 'next'
import {
  getUsersDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import { GET } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
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
  const { method } = request

  if (method === GET) {
    const result = await queryDatabase(
      SQL`
      SELECT
        uid,
        username,
        avatar,
        displaygroup,
        additionalgroups
      FROM `.append(getUsersDatabaseName()).append(SQL`.mybb_users;
    `)
    )

    response.status(StatusCodes.OK).json(result)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
