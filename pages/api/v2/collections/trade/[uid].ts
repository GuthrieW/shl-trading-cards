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

  if (method === GET) {
    const { uid } = query
    const result = await queryDatabase<Card>(
      SQL`
      SELECT collectionCard.cardID,
        collectionCard.ownedCardID,
        card.player_name,
        card.teamID,
        card.playerID,
        card.card_rarity,
        card.image_url,
        card.pullable,
        card.approved,
        card.position,
        card.overall,
        card.high_shots,
        card.low_shots,
        card.quickness,
        card.control,
        card.conditioning,
        card.skating,
        card.shooting,
        card.hands,
        card.checking,
        card.defense,
        card.author_userID,
        card.season,
        card.author_paid
      FROM `
        .append(getCardsDatabaseName())
        .append(
          SQL`.collection collectionCard
        LEFT JOIN `
        )
        .append(getCardsDatabaseName()).append(SQL`.cards card
          ON collectionCard.cardID=card.cardID
      WHERE collectionCard.userID=${uid};
    `)
    )

    response.status(StatusCodes.OK).json(result)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
