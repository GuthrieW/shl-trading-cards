import { NextApiRequest, NextApiResponse } from 'next'
import {
  getCardsDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import { GET, POST } from '@constants/index'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'
import axios from 'axios'

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

    const bankResponse = await axios({
      method: GET,
      url: `http://localhost:9001/api/v1/account/balance/${uid}`,
    })

    const subscriptionAmountIsNumber = isNaN(Number(subscriptionAmount))
    if (subscriptionAmountIsNumber) {
      response.status(StatusCodes.BAD_REQUEST).json({
        error: `Invalid Subscription Amount: ${subscriptionAmount} is not a number`,
      })
      return
    }

    const subAmount = parseInt(subscriptionAmount as string)

    if (subAmount < 0 || subAmount > 3) {
      response.status(StatusCodes.BAD_REQUEST).json({
        error: `Invalid Subscription Amount: ${subscriptionAmount} is not a number between 0 and 3`,
      })
      return
    }

    if (bankResponse.data.bankbalance < 50000 * subAmount) {
      response.status(StatusCodes.BAD_REQUEST).json({
        error: `Bank Balance Insufficient`,
      })
      return
    }

    const result = await queryDatabase(
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
