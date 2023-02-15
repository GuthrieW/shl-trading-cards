import { NextApiRequest, NextApiResponse } from 'next'
import {
  getCardsDatabaseName,
  getUsersDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import { GET } from '@constants/index'
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
  const { method, query } = request

  if (method === GET) {
    const { uid } = query

    console.log('uid', uid)
    // Get a single user
    const result = await queryDatabase(
      SQL`
      SELECT user.uid,
        user.username,
        user.avatar,
        user.usergroup,
        user.additionalgroups,
        user.displaygroup,
        settings.subscription
      FROM `
        .append(getUsersDatabaseName())
        .append(
          SQL`.mybb_users user
        LEFT JOIN `
        )
        .append(getCardsDatabaseName()).append(SQL`.settings settings
          ON user.uid=settings.userID
      WHERE user.uid=${uid};
    `)
    )
    console.log('user', result)
    response.status(StatusCodes.OK).json(result)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
