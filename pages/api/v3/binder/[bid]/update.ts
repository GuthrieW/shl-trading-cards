import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, ListResponse } from '../../'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { PUT } from '@constants/http-methods'
import { cardsQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import methodNotAllowed from '../../lib/methodNotAllowed'

const allowedMethods: string[] = [PUT] as const
const cors = Cors({
  methods: allowedMethods,
})

export default async function updateBinder(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ListResponse<null>>>
): Promise<void> {
  await middleware(req, res, cors)
  const cards = req.body.cards

  if (req.method === PUT) {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          status: 'error',
          message: 'Missing or invalid authorization token',
          payload: null,
        })
        return
      }

      if (!Array.isArray(cards) || cards.length === 0) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: 'error',
          message: 'Missing required fields: cards',
          payload: null,
        })
        return
      }

      const values = cards.map((card) => [
        card.binderID,
        card.ownedCardID,
        card.position,
      ])

      const sqlQuery = SQL`
  INSERT INTO binder_cards (binderID, ownedCardID, position) VALUES
  ${values}
  ON DUPLICATE KEY UPDATE position = VALUES(position);
`
      await cardsQuery(sqlQuery)

      res.status(StatusCodes.OK).json({
        status: 'success',
        payload: null,
      })
      return
    } catch (error) {
      console.error('Error updating binder:', error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Failed to update binder',
        payload: null,
      })
      return
    }
  }

  methodNotAllowed(req, res, allowedMethods)
}
