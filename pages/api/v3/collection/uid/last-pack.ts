import { NextApiRequest, NextApiResponse } from 'next'
import { cardsQuery } from '@pages/api/database/database'
import { GET } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'

const allowedMethods = [GET]
const cors = Cors({
  methods: allowedMethods,
})

// Define a type for the quantity result
type QuantityResult = {
  cardID: number
  quantity: number
}

// Define a type for the possible return value of cardsQuery
type CardsQueryResult = QuantityResult[] | { error: unknown } // Adjust based on your actual error type

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method, query } = request

  if (method === GET) {
    const { uid } = query

    // First query to get the cards
    const cardsResult = await cardsQuery<Card>(SQL`
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
        card.author_paid,
        collection.packID
      FROM 
        cards as card
      INNER JOIN collection AS collection
        ON card.cardID=collection.cardID
      INNER JOIN packs_owned AS pack
        ON collection.packID=pack.packID
      WHERE pack.openDate=(
        SELECT openDate
        FROM packs_owned 
        WHERE userID=${uid}
        ORDER BY openDate DESC
        LIMIT 1
      ) AND pack.userID=${uid};
    `)

    // Check if there's an error in the result
    if ('error' in cardsResult) {
      response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to retrieve cards' })
      return
    }

    // Extract cardIDs from the result
    const cardIDs = cardsResult.map((card) => card.cardID)

    // If there are cardIDs, proceed with the second query
    let quantitiesResult: CardsQueryResult = []
    let totalQuantitiesResult: CardsQueryResult = []
    if (cardIDs.length > 0) {
      const cardIDList = cardIDs.join(',')
      quantitiesResult = await cardsQuery<QuantityResult>(
        SQL`
        SELECT cardID, COUNT(*) as quantity 
        FROM collection 
        WHERE userID=${uid} AND FIND_IN_SET(cardID, ${cardIDList})
        GROUP BY cardID;
        `
      )
      totalQuantitiesResult = await cardsQuery<QuantityResult>(
        SQL`
        SELECT cardID, COUNT(*) as quantity 
        FROM collection 
        WHERE FIND_IN_SET(cardID, ${cardIDList})
        GROUP BY cardID;
        `
      )
      // Check for error in quantitiesResult
      if ('error' in quantitiesResult || 'error' in totalQuantitiesResult) {
        response
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: 'Failed to retrieve quantities' })
        return
      }
    }

    // Combine the card data with their quantities
    const combinedResult = cardsResult.map((card) => {
      const quantityEntry = (quantitiesResult as QuantityResult[]).find(
        (q) => q.cardID === card.cardID
      )
      const totalQuantityEntry = (
        totalQuantitiesResult as QuantityResult[]
      ).find((q) => q.cardID === card.cardID)

      return {
        ...card,
        quantity: quantityEntry ? quantityEntry.quantity : 0, // Quantity in recent pack
        totalCardQuantity: totalQuantityEntry ? totalQuantityEntry.quantity : 0, // Total quantity in collection
      }
    })

    response.status(StatusCodes.OK).json(combinedResult)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
