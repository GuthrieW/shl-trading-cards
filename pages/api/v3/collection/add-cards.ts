import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '..'
import middleware from '@pages/api/database/middleware'
import { POST } from '@constants/http-methods'
import Cors from 'cors'
import methodNotAllowed from '../lib/methodNotAllowed'
import SQL from 'sql-template-strings'
import { cardsQuery } from '@pages/api/database/database'
import { StatusCodes } from 'http-status-codes'
import { rateLimit } from 'lib/rateLimit'

const allowedMethods: string[] = [POST]
const cors = Cors({
  methods: allowedMethods,
})

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<void>>
) => {
  await middleware(req, res, cors)

  if (req.method === POST) {
    const newCards: Record<string, string[]> = req.body.newCardsJson as Record<
      string,
      string[]
    >

    if (!newCards) {
      res.status(StatusCodes.BAD_REQUEST).end('New cards required in request')
      return
    }

    const errors: Record<string, string> = {}
    await Promise.all(
      Object.entries(newCards).map(async ([userId, cardIds]) => {
        const query = SQL`INSERT INTO collection (userID, cardID, packID) VALUES`
        cardIds.forEach((cardId, index) =>
          index === 0
            ? query.append(SQL` (${parseInt(userId)}, ${cardId}, -1)`)
            : query.append(SQL`, (${parseInt(userId)}, ${cardId}, -1)`)
        )

        const addResult = await cardsQuery(query)
        if ('error' in addResult) {
          errors[userId] = addResult.error as string
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
export default rateLimit(handler)
