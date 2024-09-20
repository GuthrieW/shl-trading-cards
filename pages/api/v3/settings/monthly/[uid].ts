import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '../..'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { POST } from '@constants/http-methods'
import methodNotAllowed from '../../lib/methodNotAllowed'
import { cardsQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'

const allowedMethods = [POST]
const cors = Cors({
  methods: allowedMethods,
})

export default async function updateMonthlySubscription(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<null>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === POST) {
    const uid = req.query.uid as string
    const subscription = req.body.subscription as number

    if (!uid || !subscription) {
      console.error('Missing uid or subscription')
      res
        .status(StatusCodes.BAD_REQUEST)
        .end('Please provide a uid and subscription amount in your request')
      return
    }

    if (subscription < 0 || subscription > 1) {
      res.status(StatusCodes.BAD_REQUEST).end('Subscription must be 0 or 1')
      return
    }

    await cardsQuery(SQL`
      INSERT INTO monthly_subscriptions
        (userID, subscription)
      VALUES
        (${uid}, ${subscription})
      ON DUPLICATE KEY UPDATE subscription=${subscription};
    `)

    res.status(StatusCodes.OK).json({ status: 'success', payload: null })
  }

  methodNotAllowed(req, res, allowedMethods)
}
