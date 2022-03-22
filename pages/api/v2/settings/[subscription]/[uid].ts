//gets a user's quantity of unopened packs and subscription status

import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '@pages/api/database/database'
import { POST } from '@constants/index'
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
  const { method, query } = request

  // Create a user's settings or update a user's settings with a subscription
  // that will be between 0 and 3 inclusive
  if (method === POST) {
    const { uid, subscription } = query

    const result = await queryDatabase(SQL`
      INSERT INTO admin_cards.settings
        (userID, subscription)
      VALUES
        (${uid}, ${subscription})
      ON DUPLICATE KEY UPDATE subscription=${subscription};
    `)

    response.status(StatusCodes.OK).json(result)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
