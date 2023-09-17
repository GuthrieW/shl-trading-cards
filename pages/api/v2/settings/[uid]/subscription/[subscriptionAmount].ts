import { NextApiRequest, NextApiResponse } from 'next'
import {
  getCardsDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import { GET, POST } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'
import axios from 'axios'
import assertTrue from 'lib/api/assert-true'

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
    const { uid, subscriptionAmount } = query

    const subscriptionAmountIsNumber: boolean = !assertTrue(
      isNaN(Number(subscriptionAmount)),
      'Invalid Subscription Amount',
      StatusCodes.BAD_REQUEST,
      response
    )
    if (subscriptionAmountIsNumber) return

    const subAmount: number = parseInt(subscriptionAmount as string)
    const subscriptionAmountIsValid: boolean = !assertTrue(
      subAmount < 0 || subAmount > 3,
      'Invalid Subscription Amount',
      StatusCodes.BAD_REQUEST,
      response
    )
    if (subscriptionAmountIsValid) return

    await queryDatabase(
      SQL`
      INSERT INTO `.append(getCardsDatabaseName()).append(SQL`.settings
        (userID, subscription)
      VALUES
        (${uid}, ${subscriptionAmount})
      ON DUPLICATE KEY UPDATE subscription=${subscriptionAmount};
    `)
    )

    response.status(StatusCodes.OK).json({ uid })
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
