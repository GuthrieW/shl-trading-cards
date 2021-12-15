import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '@pages/api/database/database'
import { GET } from '@constants/index'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'

const allowedMethods = [GET]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method } = request

  if (method === GET) {
    const unapprovedCards: Card[] = await queryDatabase(SQL`
      SELECT 
        cardID, player_name, teamID,
        playerID, author_userID, card_rarity, 
        position, season, overall, 
        high_shots, low_shots, quickness, 
        control, conditioning, skating, 
        shooting, hands, checking,
        defense, image_url
      FROM admin_cards.cards
      WHERE 
        approved=0
        AND author_userID IS NOT NULL
        AND image_url IS NOT NULL;
    `)

    response.status(StatusCodes.OK).json(unapprovedCards)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
