import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '@pages/api/database/database'
import { POST } from '@constants/index'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'

const allowedMethods = [POST]
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

  if (method === POST) {
    const results = await queryDatabase(`
    insert into \`admin_cards\`.\`cards\`
      (player_name, teamID, playerID, card_rarity, pullable, approved, position, overall, high_shots, low_shots, quickness, control, conditioning, skating, shooting, hands, checking, defense, season)
    VALUES
      ('${player_name}',${teamID},${playerID},'${card_rarity}',0,0,'${position}',${overall},${high_shots},${low_shots},${quickness},${control},${conditioning},${skating},${shooting},${hands},${checking},${defense},${season})   
        `)
    response
      .status(StatusCodes.OK)
      .json({ result: 'card request created', card: body })
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
