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

  if (req.method !== PUT) {
    methodNotAllowed(req, res, allowedMethods)
    return
  }
  const { cards, bid, name, desc, removedPositions } = req.body
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      status: 'error',
      message: 'Missing or invalid authorization token',
      payload: null,
    })
    return
  }

  try {
    if (bid && name && desc) {
      const sqlQuery = SQL`
        UPDATE binders 
        SET binder_name = ${name}, binder_desc = ${desc} 
        WHERE binderID = ${bid}
      `
      await cardsQuery(sqlQuery)

      res.status(StatusCodes.OK).json({
        status: 'success',
        payload: null,
      })
      return
    }

    if (cards) {
      if (!Array.isArray(cards)) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: 'error',
          message: 'Cards must be an array',
          payload: null,
        })
        return
      }
      if (removedPositions && removedPositions.length > 0) {
        const deleteQuery = SQL`
          DELETE FROM binder_cards 
          WHERE binderID = ${cards[0].binderID}
          AND position IN (${removedPositions})`
        await cardsQuery(deleteQuery)
      }
      if (cards.length > 0) {
        const values = cards.map((card) => [
          card.binderID,
          card.ownedCardID,
          card.position,
        ])
        const sqlQuery = SQL`
          INSERT INTO binder_cards (binderID, ownedCardID, position) VALUES
          ${values}
          ON DUPLICATE KEY UPDATE position = VALUES(position);`
        await cardsQuery(sqlQuery)
      }

      res.status(StatusCodes.OK).json({
        status: 'success',
        payload: null,
      })
      return
    }

    res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'No valid update parameters provided, womp womp',
      payload: null,
    })
    return
  } catch (error) {
    console.error('Error updating binder:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Failed to update binder or binder name/desc',
      payload: null,
    })
    return
  }
}
