import { NextApiRequest, NextApiResponse } from 'next'
import {
  getCardsDatabaseName,
  getPortalDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import { POST } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'
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

  if (method === POST) {
    const { uid, packType } = query

    if (process.env.APP_ENV === 'production') {
      const isMissingUserId: boolean = !assertTrue(
        !uid,
        'Missing User ID',
        StatusCodes.BAD_REQUEST,
        response
      )
      if (isMissingUserId) return

      const isMissingPackType: boolean = !assertTrue(
        !packType,
        'Missing Pack Type',
        StatusCodes.BAD_REQUEST,
        response
      )
      if (isMissingPackType) return

      const hasReachedLimit = await queryDatabase(
        SQL`
          SELECT packsToday
          FROM `.append(getCardsDatabaseName()).append(SQL`.packToday
          WHERE userID=${uid};
        `)
      )

      const hasReachedPackLimit: boolean = !assertTrue(
        hasReachedLimit[0]?.packsToday >= 3,
        'Daily Pack Limit Reached',
        StatusCodes.BAD_REQUEST,
        response
      )
      if (hasReachedPackLimit) return

      const bankData = await queryDatabase(
        SQL`
          SELECT bankBalance
          FROM `.append(getPortalDatabaseName()).append(SQL`.bankBalance
          WHERE uid=${uid};
        `)
      )

      const hasInsufficientFunds: boolean = !assertTrue(
        bankData[0]?.bankBalance >= 0,
        'Insufficient Funds',
        StatusCodes.BAD_REQUEST,
        response
      )
      if (hasInsufficientFunds) return

      await queryDatabase(
        SQL`
          INSERT INTO `.append(getPortalDatabaseName())
          .append(SQL`.bankTransactions (uid, status, type, description, amount, submitByID)
          VALUES (${uid}, "completed", "cards", "Base Pack Purchase", -50000);
        `)
      )
    }

    response.status(StatusCodes.OK).json({ purchaseSuccessful: true })
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
