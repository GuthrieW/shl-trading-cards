import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '..'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { GET } from '@constants/http-methods'
import methodNotAllowed from '../lib/methodNotAllowed'
import { StatusCodes } from 'http-status-codes'
import SQL from 'sql-template-strings'
import { cardsQuery } from '@pages/api/database/database'

const allowedMethods: string[] = [GET] as const
const cors = Cors({
  methods: allowedMethods,
})

export default async function tradeEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TradeDetails[]>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const tradeID = req.query.id as string

    if (!tradeID) {
      res.status(StatusCodes.BAD_REQUEST).end('Please provide a trade ID')
      return
    }

    const queryResult = await cardsQuery<TradeDetails>(
      SQL`
        SELECT * FROM trade_details
        WHERE tradeID=${parseInt(tradeID)}
      `
    )

    if ('error' in queryResult) {
      console.error(queryResult)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    if (queryResult.length === 0) {
      console.error('Trade not found')
      res.status(StatusCodes.NOT_FOUND).end('Trade not found')
      return
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: queryResult,
    })
  }

  methodNotAllowed(req, res, allowedMethods)
}
