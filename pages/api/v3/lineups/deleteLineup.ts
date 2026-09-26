import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '..'
import middleware from '@pages/api/database/middleware'
import { DELETE } from '@constants/http-methods'
import Cors from 'cors'
import SQL from 'sql-template-strings'
import { cardsQuery } from '@pages/api/database/database'
import { StatusCodes } from 'http-status-codes'
import methodNotAllowed from '../lib/methodNotAllowed'
import { rateLimit } from 'lib/rateLimit'

const allowedMethods: string[] = [DELETE] as const
const cors = Cors({
  methods: allowedMethods,
})

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<null>>
) => {
  await middleware(req, res, cors)

  if (req.method === DELETE) {
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

      const { lineupID } = req.body

      if (!lineupID) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: 'error',
          message: 'Please provide a lineupID in your request',
          payload: null,
        })
        return
      }

      // Delete the lineup
      const deleteQuery = SQL`
        DELETE FROM game_lineup 
        WHERE lineupID = ${lineupID}
      `

      await cardsQuery(deleteQuery)

      res.status(StatusCodes.OK).json({
        status: 'success',
        payload: null,
      })
      return
    } catch (error) {
      console.error('Error deleting lineup:', error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Failed to delete lineup',
        payload: null,
      })
      return
    }
  }

  methodNotAllowed(req, res, allowedMethods)
}

export default rateLimit(handler)
