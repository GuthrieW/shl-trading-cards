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
    SELECT 
      u.uid, 
      u.username,
      u.avatar,
      u.displaygroup,
      u.additionalgroups
    FROM `
      .append(getCardsDatabaseName())
      .append(SQL`.user_info u`)

    if (name.length !== 0) {
      queryString
        .append(
          ` WHERE u.username LIKE "%${name}%"
      AND u.uid IN
      (select distinct userID from `
        )
        .append(getCardsDatabaseName())
        .append(`.collection)`)
    } else {
      queryString
        .append(
          ` WHERE u.uid IN
      (select distinct userID from `
        )
        .append(getCardsDatabaseName())
        .append(`.collection)`)
    }

    queryString.append(` ORDER BY username ASC;`)

    const result = await queryDatabase(queryString)

    console.log('result', result)
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
