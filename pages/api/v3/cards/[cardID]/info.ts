import { NextApiRequest, NextApiResponse } from 'next'
import { GET } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'
import { ApiResponse, CardMakerInfo } from '../..'
import methodNotAllowed from '../../lib/methodNotAllowed'
import { cardsQuery } from '@pages/api/database/database'

const allowedMethods = [GET]
const cors = Cors({
  methods: allowedMethods,
})

export default async function cardInfo(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<CardMakerInfo[]>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const cardID = req.query.cardID as string

    if (!cardID) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Please provide a cardID in your request',
      })
      return
    }

    const queryResult = await cardsQuery(SQL`
      SELECT c.author_userID as userID, u.username, c.date_approved FROM cards as c LEFT JOIN user_info as u ON c.author_userID = u.uid WHERE c.cardID=${cardID};
    `)

    if ('error' in queryResult) {
      console.error(queryResult)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    res
      .status(StatusCodes.OK)
      .json({ status: 'success', payload: queryResult as CardMakerInfo[] })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
