import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '../..'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { DELETE, PATCH } from '@constants/http-methods'
import methodNotAllowed from '../../lib/methodNotAllowed'
import { cardsQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'

const allowedMethods = [PATCH]
const cors = Cors({
  methods: allowedMethods,
})

export default async function updateMonthlySubscription(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<null>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === PATCH) {
    const uid = req.query.uid as string
    const subscription = req.body.subscription as string

    if (!uid || !subscription) {
      console.error('Missing uid or subscription')
      res
        .status(StatusCodes.BAD_REQUEST)
        .end('Please provide a uid and subscription amount in your request')
      return
    }

    const subscriptionAsNumber: number = parseInt(subscription)

    if (subscriptionAsNumber < 0 || subscriptionAsNumber > 1) {
      res.status(StatusCodes.BAD_REQUEST).end('Subscription must be 0 or 1')
      return
    }

    const queryResult = await cardsQuery(SQL`
      INSERT INTO monthly_subscriptions
        (uid, subscription)
      VALUES
        (${uid}, ${subscription})
      ON DUPLICATE KEY UPDATE subscription=${subscription};
    `)

    if ('error' in queryResult) {
      console.error(queryResult)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connectioned failed')
      return
    }

    res.status(StatusCodes.OK).json({ status: 'success', payload: null })
    return
  }

  if (req.method === DELETE) {
    const uid = req.query.uid as string

    if (!uid) {
      console.error('Missing uid')
      res
        .status(StatusCodes.BAD_REQUEST)
        .end('Please provide a uid and subscription amount in your request')
      return
    }

    const queryResult = await cardsQuery(SQL`
      DELETE FROM monthly_subscriptions
      WHERE uid=${uid};  
    `)

    if ('error' in queryResult) {
      console.error(queryResult)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connectioned failed')
      return
    }

    res.status(StatusCodes.OK).json({ status: 'success', payload: null })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
