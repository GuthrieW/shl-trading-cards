import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '..'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { GET } from '@constants/http-methods'
import methodNotAllowed from '../lib/methodNotAllowed'
import { StatusCodes } from 'http-status-codes'
import SQL, { SQLStatement } from 'sql-template-strings'
import { cardsQuery } from '@pages/api/database/database'
import { rateLimit } from 'lib/rateLimit'
import { parseQueryArray } from '@utils/parse-query-array'

const allowedMethods: string[] = [GET] as const
const cors = Cors({
  methods: allowedMethods,
})

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<DuplicateCardsIntrades[]>>
) => {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const tradeID = req.query.id as string
    const cardsString = req.query.cards as string
    const userID = req.query.userID as string
    const cards = cardsString.split(',')

    if (tradeID || userID || cards.length === 0) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .end('Please provide a tradeID, userID and cardIDs')
      return
    }
    const query: SQLStatement = SQL`
    SELECT 
    ta.tradeID,
    t.initiatorID,
    t.recipientID,
    c.cardID
    FROM trade_assets ta
    JOIN collection c 
    ON c.ownedCardID = ta.ownedCardID
    JOIN trades t 
    ON t.tradeID = ta.tradeID
    WHERE 
    t.trade_status = 'PENDING'
    AND (
    `
    cards.forEach((card, index) => {
      index === 0
        ? query.append(SQL`c.cardID = ${parseInt(card)}`)
        : query.append(SQL` OR c.cardID = ${parseInt(card)}`)
    })

    query.append(SQL`)
    AND c.userID = ${parseInt(userID)}      
    AND (t.initiatorID = c.userID OR t.recipientID = c.userID) 
    AND ta.tradeID != ${parseInt(tradeID)}      
    GROUP BY ta.tradeID, t.initiatorID, t.recipientID, c.cardID
    `)

    const queryResult = await cardsQuery<TradeDetails>(query)

    if ('error' in queryResult) {
      console.error(queryResult)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: queryResult,
    })
  }

  methodNotAllowed(req, res, allowedMethods)
}
export default rateLimit(handler)
