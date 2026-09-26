import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, ListResponse } from '..'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { POST } from '@constants/http-methods'
import { cardsQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'
import { checkUserAuthorization } from '../lib/checkUserAuthorization'
import { StatusCodes } from 'http-status-codes'
import methodNotAllowed from '../lib/methodNotAllowed'
import { rateLimit } from 'lib/rateLimit'

const allowedMethods: string[] = [POST] as const
const cors = Cors({
  methods: allowedMethods,
})

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ListResponse<null>>>
) => {
  await middleware(req, res, cors)

  if (req.method === POST) {
    if (!(await checkUserAuthorization(req))) {
      res.status(StatusCodes.UNAUTHORIZED).end('Not authorized')
      return
    }
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

      const lineupData = req.body

      if (!lineupData.userID || !lineupData.lineupTitle) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: 'error',
          message: 'Missing required fields',
          payload: null,
        })
        return
      }

      if (lineupData.lineupID) {
        await cardsQuery(
          SQL`UPDATE game_lineup SET 
            lineupTitle = ${lineupData.lineupTitle}, 
            centerCardID = ${lineupData.centerCardID}, 
            leftWingCardID = ${lineupData.leftWingCardID}, 
            rightWingCardID = ${lineupData.rightWingCardID}, 
            leftDefenseCardID = ${lineupData.leftDefenseCardID}, 
            rightDefenseCardID = ${lineupData.rightDefenseCardID}, 
            goalieCardID = ${lineupData.goalieCardID} 
            WHERE lineupID = ${lineupData.lineupID};`
        )
      } else {
        await cardsQuery(
          SQL`CALL create_game_lineup(${lineupData.userID}, ${lineupData.lineupTitle}, ${lineupData.centerCardID}, ${lineupData.leftWingCardID}, ${lineupData.rightWingCardID}, ${lineupData.leftDefenseCardID}, ${lineupData.rightDefenseCardID}, ${lineupData.goalieCardID});`
        )
      }

      res.status(StatusCodes.OK).json({
        status: 'success',
        payload: null,
      })
      return
    } catch (error) {
      console.error('Error saving lineup:', error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Failed to save lineup',
        payload: null,
      })
      return
    }
  }

  methodNotAllowed(req, res, allowedMethods)
}
export default rateLimit(handler)
