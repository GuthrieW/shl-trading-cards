import { POST } from '@constants/http-methods'
import middleware from '@pages/api/database/middleware'
import { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import methodNotAllowed from '../../lib/methodNotAllowed'
import { cardsQuery } from '@pages/api/database/database'
import { ApiResponse } from '../..'
import { checkUserAuthorization } from '../../lib/checkUserAuthorization'

const allowedMethods = [POST]
const cors = Cors({
  methods: allowedMethods,
})

export default async function acceptTradeEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<null>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === POST) {
    if (!(await checkUserAuthorization(req))) {
      res.status(StatusCodes.UNAUTHORIZED).end('Not authorized')
      return
    }

    const tradeID = req.query.id as string
    if (!tradeID) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .end('Provide a tradeID in your request')
      return
    }

    const tradeResult = await cardsQuery<{ recipientID: string }>(
      SQL`
      SELECT recipientID
      FROM trades WHERE tradeID=${parseInt(tradeID)}`
    )

    if ('error' in tradeResult) {
      console.error(tradeResult)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Database connection failed')
      return
    }

    if (tradeResult.length !== 1) {
      console.error(tradeResult)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end('Error fetching trade')
      return
    }

    if (req.cookies.userid !== tradeResult[0].recipientID.toString()) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .end('You are not authorized to accept this trade')
      return
    }

    const queryResult = await cardsQuery(
      SQL`CALL accept_trade(${parseInt(tradeID)})`
    )

    if ('error' in queryResult) {
      console.error(queryResult)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Database connection failed')
      return
    }

    res.status(StatusCodes.OK).json({ status: 'success', payload: null })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
