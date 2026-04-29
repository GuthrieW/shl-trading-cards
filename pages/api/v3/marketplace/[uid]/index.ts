import { NextApiRequest, NextApiResponse } from 'next'
import { cardsQuery } from '@pages/api/database/database'
import { GET } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL, { SQLStatement } from 'sql-template-strings'
import { ApiResponse, LatestCards, UserPacks } from '../..'
import { rateLimit } from 'lib/rateLimit'

const allowedMethods = [GET]
const cors = Cors({
  methods: allowedMethods,
})

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<MarketplaceCard[]>>
): Promise<void> => {
  await middleware(req, res, cors)
  const { method } = req

  if (method === GET) {
    const uid = req.query.uid as string

    const query: SQLStatement = SQL`
        SELECT 
        umc.userID,
        umc.cardID,
        umc.purchased,
        c.image_url,
        c.playerID,
        c.leagueID,
        c.player_name,
        c.card_rarity,
        mrp.cost,
        COALESCE(col.card_count, 0) AS quantity
      FROM users_marketplace_cards as umc
      left join cards as c on umc.cardID = c.cardID
      left join marketplace_rarity_prices as mrp on c.card_rarity = mrp.card_rarity
      LEFT JOIN (
          SELECT cardID, COUNT(*) AS card_count
          FROM collection
          WHERE userID = ${uid}
          GROUP BY cardID
      ) AS col ON umc.cardID = col.cardID
      WHERE userID=${uid}`

    const queryResult = await cardsQuery<MarketplaceCard>(query)

    if ('error' in queryResult) {
      console.error(queryResult.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Database connection failed')
      return
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: queryResult,
    })
    return
  }

  res.setHeader('Allowed', allowedMethods)
  res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default rateLimit(handler)
