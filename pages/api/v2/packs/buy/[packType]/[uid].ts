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
import checkBoom from '@pages/api/lib/checkBoom'

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
      const isMissingUserId: boolean = checkBoom(
        !!uid,
        'Missing User ID',
        StatusCodes.BAD_REQUEST,
        response
      )
      if (isMissingUserId) return

      const isMissingPackType: boolean = checkBoom(
        !!packType,
        'Missing Pack Type',
        StatusCodes.BAD_REQUEST,
        response
      )
      if (isMissingPackType) return

      const hasReachedLimit = await queryDatabase<{ packsToday: number }>(
        SQL`
          SELECT packsToday
          FROM `.append(getCardsDatabaseName()).append(SQL`.packToday
          WHERE userID=${uid};
        `)
      )

      const hasReachedPackLimit: boolean = checkBoom(
        hasReachedLimit.length === 0 || hasReachedLimit[0]?.packsToday < 3,
        'Daily Pack Limit Reached',
        StatusCodes.BAD_REQUEST,
        response
      )
      if (hasReachedPackLimit) return

      const bankData = await queryDatabase<{ bankBalance: number }>(
        SQL`
          SELECT bankBalance
          FROM `.append(getPortalDatabaseName()).append(SQL`.bankBalance
          WHERE uid=${uid};
        `)
      )

      const hasInsufficientFunds: boolean = checkBoom(
        bankData[0]?.bankBalance > 0,
        'Insufficient Funds',
        StatusCodes.BAD_REQUEST,
        response
      )
      if (hasInsufficientFunds) return

      await queryDatabase(
        SQL`
          INSERT INTO `.append(getPortalDatabaseName())
          .append(SQL`.bankTransactions (uid, status, type, description, amount, submitByID)
          VALUES (${uid}, "completed", "cards", "Base Pack Purchase", -50000, 0);
        `)
      )

      await queryDatabase(
        SQL`
        INSERT INTO `.append(getCardsDatabaseName()).append(SQL`.packs_owned
          (userID, packType, source)
        VALUES (${uid}, ${packType}, "Pack Shop");
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
