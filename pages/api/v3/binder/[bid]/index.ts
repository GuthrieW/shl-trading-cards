import { NextApiRequest, NextApiResponse } from 'next'
import { cardsQuery } from '@pages/api/database/database'
import { GET } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'
import { ApiResponse, binderCards, UserPacks } from '../..'

const allowedMethods = [GET]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<binderCards[]>>
): Promise<void> => {
  await middleware(req, res, cors)

  if (req.method === GET) {
    if (req.method !== 'GET') {
      res.status(405).end(`Method ${req.method} Not Allowed`)
      return
    }

    const binderID = req.query.bid
    const result = await cardsQuery<binderCards>(
      SQL`
      SELECT 
    binder_cards.binderID,
    binder_cards.ownedCardID,
    binder_cards.position,
    collection.cardID,
    collection.userID,
    cards.player_name,
    cards.teamID,
    cards.playerID,
    cards.card_rarity,
    cards.image_url,
    cards.overall,
    cards.season
FROM 
    binder_cards
JOIN 
    collection ON binder_cards.ownedCardID = collection.ownedCardID
JOIN 
    cards ON collection.cardID = cards.cardID
WHERE binder_cards.binderID =${binderID}`
    )
    if ('error' in result) {
      console.error(result.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Database connection failed')
      return
    }
    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: result,
    })
    return
  }

  res.setHeader('Allowed', allowedMethods)
  res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
