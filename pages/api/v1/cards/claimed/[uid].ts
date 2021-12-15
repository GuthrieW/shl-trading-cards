import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '@pages/api/database/database'
import { GET, PATCH } from '@constants/index'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'

const allowedMethods = [PATCH]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method } = request
  const { uid } = request.query

  if (method === GET) {
    const result = await queryDatabase(SQL`
      SELECT
        cardID, player_name, teamID,
        playerID, card_rarity, image_url
        pullable, approved, position,
        overall, high_shots, low_shots,
        quickness, control, conditioning,
        skating, shooting, hands,
        checking, defense, author_userID,
        season 
      FROM admin_cards.claimed_cards
      WHERE uid=${uid};
    `)

    response.status(StatusCodes.OK).json(result)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
