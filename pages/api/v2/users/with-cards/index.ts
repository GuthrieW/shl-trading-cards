import { NextApiRequest, NextApiResponse } from 'next'
import {
  getCardsDatabaseName,
  getUsersDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import { POST } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
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
  const { method, body } = request

  if (method === POST) {
    const { page, name } = body
    const queryString = SQL`
      SELECT DISTINCT collection.userID,
        mybb_users.uid,
        mybb_users.username,
        mybb_users.avatar,
        mybb_users.displaygroup,
        mybb_users.additionalgroups
      FROM `
      .append(getUsersDatabaseName())
      .append(
        SQL`.mybb_users
      INNER JOIN `
      )
      .append(getCardsDatabaseName()).append(SQL`
      .collection
        ON mybb_users.uid=collection.userID
    `)

    if (name.length !== 0) {
      queryString.append(` WHERE username LIKE "%${name}%"`)
    }

    queryString.append(` ORDER BY username ASC;`)

    const result = await queryDatabase(queryString)

    if (page === -1) {
      response.status(StatusCodes.OK).json({
        users: result,
        total: result.length,
      })
    } else {
      response.status(StatusCodes.OK).json({
        users: result.slice(page * 25, page * 25 + 25),
        total: Math.ceil(result.length / 25),
      })
    }

    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
