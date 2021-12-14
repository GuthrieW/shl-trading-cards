import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '@pages/api/database/database'
import { PATCH } from '@constants/index'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'

const allowedMethods = []
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { body, method } = request
  const { player_name, teamID, playerID, card_rarity, position, overall, high_shots, low_shots, quickness, control, conditioning, skating, shooting, hands, checking, defense, season } = request.body

  if (method === PATCH) {

    const results = await queryDatabase(`
    update admin_cards.cards
    set
    player_name = '${player_name}'
    ,teamID = ${teamID}
    ,playerID = ${playerID}
    ,card_rarity = '${card_rarity}'
    ,position = '${position}'
    ,overall = ${overall}
    ,high_shots = ${high_shots}
    ,low_shots = ${low_shots}
    ,quickness = ${quickness}
    ,control = ${control}
    ,conditioning = ${conditioning}
    ,skating = ${skating}
    ,shooting = ${shooting}
    ,hands = ${hands}
    ,checking = ${checking}
    ,defense = ${defense}
    ,season = ${season}
    `)
    response
      .status(StatusCodes.OK)
      .json({ result: 'card request created', card: body })
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
