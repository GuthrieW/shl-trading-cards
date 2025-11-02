import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '..'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { GET } from '@constants/http-methods'
import methodNotAllowed from '../lib/methodNotAllowed'
import { StatusCodes } from 'http-status-codes'
import SQL from 'sql-template-strings'
import { cardsQuery } from '@pages/api/database/database'
import { rateLimit } from 'lib/rateLimit'

const allowedMethods: string[] = [GET] as const
const cors = Cors({
  methods: allowedMethods,
})

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TradeDetails[]>>
) => {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const tradeID = req.query.id as string

    if (!tradeID) {
      res.status(StatusCodes.BAD_REQUEST).end('Please provide a trade ID')
      return
    }

    const queryResult = await cardsQuery<TradeDetails>(
      SQL`
      SELECT 
        dt.tradeID,
        dt.initiatorID,
        dt.recipientID,
        dt.trade_status,
        dt.ownedcardid,
        dt.cardID,
        dt.image_url,
        dt.toID,
        dt.fromID,
        dt.create_date,
        dt.update_date,
        c.card_rarity,
        c.sub_type,
        COALESCE(oci.quantity, 0) AS initiator_quantity,
        COALESCE(ocr.quantity, 0) AS recipient_quantity
      FROM trade_details AS dt
      LEFT JOIN ownedCards AS oci
        ON oci.cardID = dt.cardID
      AND oci.userID = dt.initiatorID
      LEFT JOIN ownedCards AS ocr
        ON ocr.cardID = dt.cardID
      AND ocr.userID = dt.recipientID
      LEFT JOIN cards as c 
        ON c.cardID = dt.cardID
      WHERE dt.tradeID = ${parseInt(tradeID)}
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
export default rateLimit(handler)
