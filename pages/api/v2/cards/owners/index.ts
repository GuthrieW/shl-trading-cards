import { NextApiRequest, NextApiResponse } from 'next'
import {
  getCardsDatabaseName,
  getUsersDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import { POST } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'
import checkBoom from '@pages/api/lib/checkBoom'

const allowedMethods = [POST]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method, body } = request

  // Get all owners of cards matching the query
  if (method === POST) {
    const {
      name,
      teams,
      rarities,
      page,
    }: { name: string; teams: string[]; rarities: string[]; page: number } =
      body

    const query = SQL`
    SELECT 
      user.username,
      user.uid AS userID,
      card.cardID,
      card.player_name,
      card.card_rarity,
      card.image_url,
      card.teamID,
      card.overall
    FROM `
      .append(getCardsDatabaseName())
      .append(
        `.ownedCards ownedCard
    LEFT JOIN `
      )
      .append(getCardsDatabaseName())
      .append(
        SQL`.cards card
      ON ownedCard.cardID = card.cardID
    LEFT JOIN `
      )
      .append(getUsersDatabaseName()).append(SQL`.mybb_users user
      ON ownedCard.userID = user.uid `)

    const hasAtLeastOneParameter: boolean = checkBoom(
      name.length !== 0 || teams.length !== 0 || rarities.length !== 0,
      'At least one parameter required',
      StatusCodes.BAD_REQUEST,
      response
    )
    if (hasAtLeastOneParameter) return

    if (name.length !== 0 || teams.length !== 0 || rarities.length !== 0) {
      query.append(' WHERE')
    }

    let isFirstWhere = true

    if (name.length !== 0) {
      isFirstWhere ? (isFirstWhere = false) : query.append(' AND')
      query.append(` player_name LIKE "%${name}%"`)
    }

    if (teams.length !== 0) {
      isFirstWhere ? (isFirstWhere = false) : query.append(' AND')
      query.append(' (')
      teams.forEach((team, index) =>
        index === 0
          ? query.append(SQL`card.teamID=${team}`)
          : query.append(SQL` OR card.teamID=${team}`)
      )
      query.append(')')
    }

    if (rarities.length !== 0) {
      isFirstWhere ? (isFirstWhere = false) : query.append(' AND')
      query.append(' (')
      rarities.forEach((rarity, index) =>
        index === 0
          ? query.append(SQL`card_rarity=${rarity}`)
          : query.append(SQL` OR card_rarity=${rarity}`)
      )
      query.append(')')
    }

    query.append(` ORDER BY overall DESC`)

    const result = await queryDatabase<Card>(query)

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
