import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '../..'
import middleware from '@pages/api/database/middleware'
import { POST } from '@constants/http-methods'
import methodNotAllowed from '../../lib/methodNotAllowed'
import Cors from 'cors'
import { StatusCodes } from 'http-status-codes'
import { checkUserAuthorization } from '../../lib/checkUserAuthorization'
import { cardsQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'
import { rarityMap } from '@constants/rarity-map'

const allowedMethods = [POST]
const cors = Cors({
  methods: allowedMethods,
})

export default async function misprintEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<null>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === POST) {
    const cardID = req.query.cardID as string

    if (!cardID) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Please provide a cardID in your request',
      })
      return
    }

    if (!(await checkUserAuthorization(req))) {
      res.status(StatusCodes.UNAUTHORIZED).end('Not authorized')
      return
    }

    const cardResult = await cardsQuery<Card>(
      SQL`SELECT * FROM cards WHERE cardID=${cardID};`
    )

    if ('error' in cardResult) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed on select')
      return
    }

    const card: Card = cardResult[0]
    console.log('card', card)

    const insertResult = await cardsQuery(SQL`
        INSERT INTO cards
          (player_name, teamID, playerID, card_rarity, sub_type, pullable, approved, position, overall, high_shots, low_shots, quickness, control, conditioning, skating, shooting, hands, checking, defense, season, author_paid)
        VALUES 
          (${card.player_name}, ${card.teamID}, ${card.playerID}, ${card.card_rarity}, ${card.sub_type}, 0, 0, ${card.position}, ${card.overall}, ${card.high_shots}, ${card.low_shots}, ${card.quickness}, ${card.control}, ${card.conditioning}, ${card.skating}, ${card.shooting}, ${card.hands}, ${card.checking}, ${card.defense}, ${card.season}, 0);        
    `)
    console.log('insertResult', insertResult)

    if ('error' in insertResult) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed on insert')
      return
    }

    const updateResult = await cardsQuery(SQL`
      UPDATE cards
      SET card_rarity=${rarityMap.misprint.value}, pullable = 0 
      WHERE cardID=${card.cardID};
    `)

    if ('error' in updateResult) {
      console.log('updateResult', updateResult)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed on update')
      return
    }

    res.status(StatusCodes.OK).json({ status: 'success', payload: null })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
