import { GET, POST } from '@constants/http-methods'
import {
  getCardsDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { StatusCodes } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'
import SQL from 'sql-template-strings'

const allowedMethods = [GET, POST]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { body, method } = request

  if (method === POST) {
    const { uid, subscription } = body

    const subscriptionQuery = await queryDatabase<{
      uid: Number
      subscription: number
    }>(
      SQL`
        SELECT uid, subscription
        FROM `.append(getCardsDatabaseName()).append(SQL`.monthly_subscriptions 
        WHERE uid=${uid};
      `)
    )
    const subscriptionExsts: boolean = subscriptionQuery.length !== 0

    const result = subscriptionExsts
      ? await queryDatabase(
          SQL`
            UPDATE `.append(getCardsDatabaseName())
            .append(SQL`.monthly_subscriptions 
            SET subscription = ${subscription}
            WHERE uid = ${uid};
          `)
        )
      : await queryDatabase(
          SQL`
            INSERT INTO `.append(getCardsDatabaseName())
            .append(SQL`.monthly_subscriptions 
              (uid, subscription)
            VALUES
              (${uid}, ${subscription});
          `)
        )

    response.status(StatusCodes.OK).json(result)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
