import { NextApiRequest, NextApiResponse } from 'next'
import {
  getCardsDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import { GET, POST } from '@constants/index'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'

const allowedMethods = [GET, POST]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method, body } = request

  // Get all cards
  if (method === GET) {
    const result = await queryDatabase(
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
      FROM `.append(getCardsDatabaseName()).append(SQL`.cards;
    `)
    )

    response.status(StatusCodes.OK).json(result)
    return
  }

  // Insert a new card
  if (method === POST) {
    const { card } = body
    const {
      player_name,
      teamID,
      playerID,
      card_rarity,
      sub_type,
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
    } = card

    const result = await queryDatabase(
      SQL`
      INSERT INTO `.append(getCardsDatabaseName()).append(SQL`.cards
        (player_name, teamID, playerID, card_rarity, sub_type, pullable, approved, position, overall, high_shots, low_shots, quickness, control, conditioning, skating, shooting, hands, checking, defense, season, author_paid)
      VALUES
      (${player_name}, ${teamID}, ${playerID}, ${card_rarity}, ${sub_type}, 0, 0, ${position}, ${overall}, ${high_shots}, ${low_shots}, ${quickness}, ${control}, ${conditioning}, ${skating}, ${shooting}, ${hands}, ${checking}, ${defense}, ${season}, 0);
    `)
    )

    response.status(StatusCodes.OK).json(result)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
