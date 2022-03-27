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
  const { method, query } = request

  if (method === GET) {
    const { uid } = query
    const result = await queryDatabase(SQL`
      SELECT collection.userID,
        card.cardID,
        pack.packID,
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
      FROM admin_cards.cards as card
      INNER JOIN admin_cards.collection AS collection
        ON card.cardID=collection.cardID
      INNER JOIN admin_cards.packs_owned AS pack
        ON collection.packID=pack.packID
      WHERE pack.openDate=(
        SELECT openDate
        FROM admin_cards.packs_owned 
        WHERE userID=${uid}
        ORDER BY openDate DESC
        LIMIT 1
      ) AND pack.userID=${uid};
    `)

    response.status(StatusCodes.OK).json(result)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
