import { NextApiRequest, NextApiResponse } from 'next'
import {
  getCardsDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import { PATCH } from '@constants/http-methods'
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
  const { method, query, body } = request

  if (method === PATCH) {
    const { cardID } = query
    const newCardData: Card = body.card

    const result = await queryDatabase(
      SQL`UPDATE `.append(getCardsDatabaseName())
        .append(SQL`.cards SET player_name=${newCardData.player_name},
        playerID=${newCardData.playerID},
        teamID=${newCardData.teamID},
        author_userID=${newCardData.author_userID},
        approved=${newCardData.approved},
        pullable=${newCardData.pullable},
        author_paid=${newCardData.author_paid},
        image_url=${newCardData.image_url},
        card_rarity=${newCardData.card_rarity},
        sub_type=${newCardData.sub_type},
        season=${newCardData.season},
        position=${newCardData.position},
        overall=${newCardData.overall},
        skating=${newCardData.skating},
        shooting=${newCardData.shooting},
        hands=${newCardData.hands},
        checking=${newCardData.checking},
        defense=${newCardData.defense},
        high_shots=${newCardData.high_shots},
        low_shots=${newCardData.low_shots},
        quickness=${newCardData.quickness},
        control=${newCardData.control},
        conditioning=${newCardData.conditioning}
      WHERE cardID=${cardID};
    `)
    )

    response.status(StatusCodes.OK).json(result)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
