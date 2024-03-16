import { NextApiRequest, NextApiResponse } from 'next'
import {
  getCardsDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import { GET } from '@constants/http-methods'
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
  const { method, query } = request

  // Get a single card
  if (method === GET) {
    const { cardID } = query

    const result: Card[] = await queryDatabase<Card>(
      SQL`
      SELECT cardID,
        player_name,
        teamID,
        playerID,
        card_rarity,
        sub_type,
        image_url,
        pullable,
        approved,
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
        author_userID,
        season,
        author_paid
      FROM `.append(getCardsDatabaseName()).append(SQL`.ownedCards
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
