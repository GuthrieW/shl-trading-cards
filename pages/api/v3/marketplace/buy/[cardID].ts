import { NextApiRequest, NextApiResponse } from 'next'
import { POST } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'
import assertBoom from '@pages/api/lib/assertBoom'
import { cardsQuery, portalQuery } from '@pages/api/database/database'
import { checkUserAuthorization } from '@pages/api/v3/lib/checkUserAuthorization'
import { rateLimit } from 'lib/rateLimit'

const allowedMethods = [POST]
const cors = Cors({
  methods: allowedMethods,
})

interface PackPurchaseRequest extends NextApiRequest {
  query: {
    cardID: string
  }
}

const handler = async (
  req: PackPurchaseRequest,
  res: NextApiResponse
): Promise<void> => {
  await middleware(req, res, cors)
  const { method } = req

  if (method === POST) {
    if (!(await checkUserAuthorization(req))) {
      res.status(StatusCodes.UNAUTHORIZED).end('Not authorized')
      return
    }

    try {
      const card = req.body.card as MarketplaceCard

      const isMissingCard: boolean = assertBoom(
        !!card,
        res,
        'Missing card',
        StatusCodes.BAD_REQUEST
      )
      if (isMissingCard) return

      const cardIDNotInDB = await cardsQuery<{ cardID: number }>(
        SQL`
        SELECT cardID
        FROM users_marketplace_cards
        WHERE userID=${card.userID} AND cardID=${card.cardID};`
      )

      if (!cardIDNotInDB) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'CardID not found in users_marketplace_cards' })
        return
      }

      const cardPriceData = await cardsQuery<{ cost: number }>(
        SQL`
        SELECT mrp.cost
        FROM users_marketplace_cards as umc
        left join cards as c on umc.cardID = c.cardID
        left join marketplace_rarity_prices as mrp
          on c.card_rarity = mrp.card_rarity
        WHERE umc.userID=${card.userID} AND umc.cardID=${card.cardID};`
      )
      const cardPrice = Number(cardPriceData[0]?.cost)
      const sameprice = cardPrice === card.cost
      const hasPrice: boolean = assertBoom(
        !!sameprice,
        res,
        'Card price not found',
        StatusCodes.BAD_REQUEST
      )
      if (hasPrice) return

      const bankData = await portalQuery<{ bankBalance: number }>(
        SQL`
            SELECT bankBalance
            FROM bankBalance
            WHERE uid=${card.userID};`
      )

      const hasInsufficientFunds: boolean = assertBoom(
        bankData[0]?.bankBalance > 0,
        res,
        'Insufficient Funds',
        StatusCodes.BAD_REQUEST
      )
      if (hasInsufficientFunds) return

      await portalQuery(
        SQL`
          INSERT INTO bankTransactions (uid, status, type, description, amount, submitByID)
          VALUES (
            ${card.userID}, 
            "completed", 
            "cards", 
            ${`Purchase of ${card.player_name} - ${card.card_rarity} from marketplace`},
            ${-card.cost}, 
            0
          );
        `
      )

      await cardsQuery(
        SQL`
          INSERT INTO collection (userID, cardID, packID) VALUES (${card.userID}, ${card.cardID}, -2);`
      )

      await cardsQuery(
        SQL`
          UPDATE users_marketplace_cards 
          set purchased = 1
          WHERE userID=${card.userID} AND cardID=${card.cardID};`
      )

      res.status(StatusCodes.OK).json({ purchaseSuccessful: true })
      return
    } catch (error) {
      res
        .status(500)
        .end(
          error instanceof Error ? error.message : 'Server connection failed'
        )
      return
    }
  }

  res.setHeader('Allowed', allowedMethods)
  res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default rateLimit(handler)
