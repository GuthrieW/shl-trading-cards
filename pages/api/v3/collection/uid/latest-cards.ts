import { NextApiRequest, NextApiResponse } from 'next'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { GET } from '@constants/http-methods'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import methodNotAllowed from '../../lib/methodNotAllowed'
import { ApiResponse, LatestCards } from '../..'
import { cardsQuery } from '@pages/api/database/database'

const allowedMethods: string[] = [GET]
const cors = Cors({
  methods: allowedMethods,
})

export default async function latestCardsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LatestCards[] | null>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const packID = req.query.packID as string

    if (!packID) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: 'error', message: 'Missing packID' })
      return
    }

    const queryResult = await cardsQuery<LatestCards>(SQL`
            SELECT col.ownedCardID, col.userID, col.cardID, col.packID,c.player_name, c.playerID, c.card_rarity, c.image_url as imageURL
FROM collection col
JOIN cards c ON col.cardID = c.cardID
WHERE col.packID =  ${packID}
        `)

    if ('error' in queryResult) {
      console.error(queryResult.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Database connection failed')
      return
    }

    if (queryResult.length === 0) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: 'error', message: 'No cards found for this pack' })
      return
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: queryResult,
    })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
