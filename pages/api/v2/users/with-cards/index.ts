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
  const { method } = request

  if (method === GET) {
    const result = await queryDatabase(
      SQL`
      SELECT DISTINCT collection.userID,
        mybb_users.uid,
        mybb_users.username,
        mybb_users.avatar,
        mybb_users.displaygroup,
        mybb_users.additionalgroups
      FROM `
        .append(getUsersDatabaseName())
        .append(
          `.mybb_users
      INNER JOIN `
        )
        .append(getCardsDatabaseName()).append(`
      .collection
        ON mybb_users.uid=collection.userID;
    `)
    )

    response.status(StatusCodes.OK).json(result)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
