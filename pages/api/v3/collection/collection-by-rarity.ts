import { NextApiRequest, NextApiResponse } from 'next'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { GET } from '@constants/http-methods'
import SQL, { SQLStatement } from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import methodNotAllowed from '../lib/methodNotAllowed'
import { ApiResponse, UserUniqueCollection } from '..'
import { cardsQuery } from '@pages/api/database/database'

const allowedMethods: string[] = [GET]
const cors = Cors({
  methods: allowedMethods,
})

export default async function uniqueCardsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<InternalUserUniqueCollection[] | null>>
): Promise<void> {
  await middleware(req, res, cors)
  const card_rarity = req.query.card_rarity as string
  const userID = req.query.userID as string
  if (req.method === GET) {
    const queryString: SQLStatement = SQL`
      SELECT 
    uuc.userID,
    ui.username,
    uuc.card_rarity,
    uuc.owned_count,
    uuc.rarity_rank
FROM
    user_unique_cards uuc JOIN user_info ui ON uuc.userID = ui.uid WHERE 1 `
    if (card_rarity) {
      queryString.append(SQL` and uuc.card_rarity = ${card_rarity}`)
    }
    if (userID) {
      queryString.append(SQL` AND uuc.userID = ${userID}`)
    }
    queryString.append(SQL`
    
    GROUP BY uuc.userID, ui.username, uuc.card_rarity `)

    const queryResult = await cardsQuery<UserUniqueCollection>(queryString)
    if ('error' in queryResult) {
      console.error(queryResult.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Database connection failed')
      return
    }

    if (queryResult.length === 0) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: 'error', message: 'Something happened' })
      return
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: queryResult,
    })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
