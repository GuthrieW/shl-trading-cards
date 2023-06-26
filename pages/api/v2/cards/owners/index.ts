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
    }: { name: string; teams: string[]; rarities: string[] } = body

    if (name === '') {
      response.status(StatusCodes.OK).json([])
      return
    }

    const searchQuery = SQL`
      SELECT cardID,
        player_name,
        image_url,
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
        season
      FROM `
      .append(getCardsDatabaseName())
      .append(
        SQL`.cards
      WHERE player_name LIKE "%`
          .append(name)
          .append(SQL`%"`)
      )
    if (teams.length !== 0) {
      searchQuery.append(' AND (')
      teams.forEach((team, index) =>
        index === 0
          ? searchQuery.append(SQL`teamID=${team}`)
          : searchQuery.append(SQL` OR teamID=${team}`)
      )
      searchQuery.append(')')
    }

    if (rarities.length !== 0) {
      searchQuery.append(' AND (')
      rarities.forEach((rarity, index) =>
        index === 0
          ? searchQuery.append(SQL`card_rarity=${rarity}`)
          : searchQuery.append(SQL` OR card_rarity=${rarity}`)
      )
      searchQuery.append(')')
    }
    searchQuery.append(';')

    const cardsMatchingQuery = await queryDatabase(searchQuery)

    const cardsWithOwners: {
      card: Card
      users: { quantity: number; uid: number; username: string }[]
    }[] = await Promise.all(
      await cardsMatchingQuery.map(async (card) => {
        const cardOwners = await queryDatabase(
          SQL`
          SELECT ownedCards.userID, ownedCards.quantity, u.username 
          FROM `
            .append(getCardsDatabaseName())
            .append(
              `.ownedCards 
          LEFT JOIN `
            )
            .append(getUsersDatabaseName())
            .append(`.mybb_users u ON ownedCards.userID=u.uid 
          WHERE ownedCards.cardID=${card.cardID};
          `)
        )

        return {
          card: card,
          users: cardOwners,
        }
      })
    )

    const filteredCardsWithOwners = cardsWithOwners.filter(
      (cardJoinedWithUser) => cardJoinedWithUser.users.length !== 0
    )

    response.status(StatusCodes.OK).json(filteredCardsWithOwners)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
