import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '@pages/api/database/database'
import { PATCH } from '@constants/index'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'

const allowedMethods = []
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method } = request
  const { id } = request.query
  const {
    cardID,
    teamID,
    playerID,
    player_name,
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
    checking,
    defense,
    season,
  } = request.body

  if (method === PATCH) {
    const result = await queryDatabase(SQL`
      UPDATE admin_cards.cards
      SET player_name='${player_name}',
        teamID=${teamID},
        playerID=${playerID},
        card_rarity='${card_rarity}',
        position='${position}',
        overall=${overall},
        high_shots=${high_shots},
        low_shots=${low_shots},
        quickness=${quickness},
        control=${control},
        conditioning=${conditioning},
        skating=${skating},
        shooting=${shooting},
        hands=${hands},
        checking=${checking},
        defense=${defense},
        season=${season}
      WHERE cardID=${id};
    `)

    response.status(StatusCodes.OK).json(result)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
