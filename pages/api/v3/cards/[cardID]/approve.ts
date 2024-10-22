import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '../..'
import middleware from '@pages/api/database/middleware'
import { POST } from '@constants/http-methods'
import Cors from 'cors'
import methodNotAllowed from '../../lib/methodNotAllowed'
import { StatusCodes } from 'http-status-codes'
import { cardsQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'

const allowedMethods: string[] = [POST] as const
const cors = Cors({
  methods: allowedMethods,
})

export default async function approveImageEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<null | string>>
): Promise<void> {
  await middleware(req, res, cors)
  if (req.method === POST) {
    const cardID = req.query.cardID as string

    if (!cardID) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Please provide a cardID in your request',
      })
      return
    }

    const count = await cardsQuery<{ total: number }>(SQL`
      SELECT count(*) as total
      FROM cards
      WHERE cardID=${cardID}
    `)

    if ('error' in count) {
      console.error(count)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    if (count[0].total > 1) {
      console.error('Multiple cards with same id')
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Multiple cards with same id')
      return
    }

    if (count[0].total === 0) {
      console.error('Card not found')
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end('Card not found')
      return
    }

    const queryResult = await cardsQuery(SQL`
      UPDATE cards
      SET approved=1, pullable=1
      WHERE cardID=${cardID};
    `)

    if ('error' in queryResult) {
      console.error(queryResult)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
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
