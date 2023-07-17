import { NextApiRequest, NextApiResponse } from 'next'
import {
  getCardsDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import { POST } from '@constants/http-methods'
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
  const { method, query, body } = request

  if (method === POST) {
    const { uid } = query
    const { name, teams, rarities, page } = body
    const queryString = SQL`
      SELECT ownedCard.quantity,
        ownedCard.cardID,
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
        SQL`.ownedCards ownedCard
        LEFT JOIN `
      )
      .append(getCardsDatabaseName()).append(SQL`.cards card
          ON ownedCard.cardID=card.cardID
      WHERE ownedCard.userID=${uid}
    `)

    if (name.length !== 0) {
      queryString.append(` AND player_name LIKE "%${name}%"`)
    }

    if (teams.length !== 0) {
      queryString.append(' AND (')
      teams.forEach((team, index) =>
        index === 0
          ? queryString.append(SQL`teamID=${team}`)
          : queryString.append(SQL` OR teamID=${team}`)
      )
      queryString.append(')')
    }

    if (rarities.length !== 0) {
      queryString.append(' AND (')
      rarities.forEach((rarity, index) =>
        index === 0
          ? queryString.append(SQL`card_rarity=${rarity}`)
          : queryString.append(SQL` OR card_rarity=${rarity}`)
      )
      queryString.append(')')
    }

    queryString.append(` ORDER BY overall DESC;`)

    const result = await queryDatabase(queryString)

    response.status(StatusCodes.OK).json({
      cards: result.slice(page * 25, page * 25 + 25),
      total: Math.ceil(result.length / 25),
    })
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
