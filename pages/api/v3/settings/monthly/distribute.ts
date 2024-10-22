import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '../..'
import middleware from '@pages/api/database/middleware'
import { POST } from '@constants/http-methods'
import Cors from 'cors'
import methodNotAllowed from '../../lib/methodNotAllowed'
import { cardsQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import { packService } from 'services/packService'

type SubscriptionUser = {
  uid: number
  subscription: number
}

const allowedMethods: string[] = [POST]
const cors = Cors({
  methods: allowedMethods,
})

export default async function distributeMonthlySubscriptionsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<void>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === POST) {
    const subscribedUsersResult = await cardsQuery<SubscriptionUser>(SQL`
      SELECT uid, subscription 
      FROM admin_cards.monthly_subscriptions
      WHERE subscription > 0
    `)

    if ('error' in subscribedUsersResult) {
      console.error(subscribedUsersResult.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Error fetching subscribed users')
      return
    }

    const errors: Record<string, string> = {}
    await Promise.all(
      subscribedUsersResult.map(async (subscribedUser) => {
        for (let i = 0; i < 10; i++) {
          const packAddResult = await cardsQuery(SQL`
            INSERT INTO packs_owned
              (userID, packType, source)
            VALUES
            (${subscribedUser.uid},${packService.packs.base.id}, "Monthly Subscription")
          `)

          if ('error' in packAddResult) {
            errors[subscribedUser.uid] = packAddResult.error as string
          }
        }
      })
    )

    if (Object.keys(errors).length !== 0) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: JSON.stringify(errors),
      })
      return
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: null,
    })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
