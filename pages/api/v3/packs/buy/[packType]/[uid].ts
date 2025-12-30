import { NextApiRequest, NextApiResponse } from 'next'
import { POST } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'
import assertBoom from '@pages/api/lib/assertBoom'
import { cardsQuery, portalQuery } from '@pages/api/database/database'
import { packService } from 'services/packService'
import { checkUserAuthorization } from '@pages/api/v3/lib/checkUserAuthorization'
import { rateLimit } from 'lib/rateLimit'

const allowedMethods = [POST]
const cors = Cors({
  methods: allowedMethods,
})

interface PackPurchaseRequest extends NextApiRequest {
  query: {
    uid: string
    packType: string
  }
}

const PACK_LIMITS = {
  base: 3,
  ruby: 1,
}

const handler = async (
  req: PackPurchaseRequest,
  res: NextApiResponse
): Promise<void> => {
  await middleware(req, res, cors)
  const { method, query } = req

  if (method === POST) {
    if (!(await checkUserAuthorization(req))) {
      res.status(StatusCodes.UNAUTHORIZED).end('Not authorized')
      return
    }

    try {
      const uid = req.query.uid as string
      const packType = req.query.packType as string

      const isMissingUserId: boolean = assertBoom(
        !!uid,
        res,
        'Missing User ID',
        StatusCodes.BAD_REQUEST
      )
      if (isMissingUserId) return

      const isMissingPackType: boolean = assertBoom(
        !!packType,
        res,
        'Missing Pack Type',
        StatusCodes.BAD_REQUEST
      )
      if (isMissingPackType) return

      const hasReachedLimit = await cardsQuery<{ PackCount }>(
        SQL`
            SELECT base,ruby
            FROM packToday
            WHERE userID=${uid};`
      )

      if ('error' in hasReachedLimit) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: 'Error fetching pack limit data' })
        return
      }

      const currentCount = hasReachedLimit[0]?.[packType] || 0
      const hasReachedPackLimit: boolean = assertBoom(
        hasReachedLimit.length === 0 || currentCount < PACK_LIMITS[packType],
        res,
        `Daily Pack Limit of ${PACK_LIMITS[packType]} Reached for ${packType} pack`,
        StatusCodes.BAD_REQUEST
      )

      if (hasReachedPackLimit) return
      const bankData = await portalQuery<{ bankBalance: number }>(
        SQL`
            SELECT bankBalance
            FROM bankBalance
            WHERE uid=${uid};`
      )

      const hasInsufficientFunds: boolean = assertBoom(
        bankData[0]?.bankBalance > 0,
        res,
        'Insufficient Funds',
        StatusCodes.BAD_REQUEST
      )
      if (hasInsufficientFunds) return

      if (packService.packs[packType].price !== 0) {
        await portalQuery(
          SQL`
          INSERT INTO bankTransactions (uid, status, type, description, amount, submitByID)
          VALUES (
            ${uid}, 
            "completed", 
            "cards", 
            ${packService.packs[packType].purchaseText},
            ${-packService.packs[packType].price}, 
            0
          );
        `
        )
      }

      await cardsQuery(
        SQL`
          INSERT INTO packs_owned
            (userID, packType, source)
          VALUES (${uid}, ${packType}, "Pack Shop");`
      )

      res.status(StatusCodes.OK).json({ purchaseSuccessful: true })
      return
    } catch (error) {
      res
        .status(500)
        .end(
          error instanceof Error ? error.message : 'Server connection failed'
        )
      return
    }
  }

  res.setHeader('Allowed', allowedMethods)
  res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default rateLimit(handler)
