import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '@pages/api/database/database'
import { POST } from '@constants/index'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'

const allowedMethods = [POST]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method } = request
  const {
    player_name,
    teamID,
    playerID,
    card_rarity,
    position,
    overall,
    high_shots,
    low_shots,
    quickness,
    control,
    conditioning,
    skating,
    shooting,
    hands,
    season,
    checking,
    defense,
  } = request.body.requestedCard

  if (method === POST) {
    const result = await queryDatabase(SQL`
      INSERT INTO admin_cards.cards
        (player_name, teamID, playerID, card_rarity, pullable, approved, position, overall, high_shots, low_shots, quickness, control, conditioning, skating, shooting, hands, checking, defense, season, author_paid,)
      VALUES
        (${player_name}, ${teamID}, ${playerID}, ${card_rarity}, 0, 0, ${position}, ${overall}, ${high_shots}, ${low_shots}, ${quickness}, ${control}, ${conditioning}, ${skating}, ${shooting}, ${hands}, ${checking}, ${defense}, ${season}, 0);  
    `)

    response.status(StatusCodes.OK).json(result)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
