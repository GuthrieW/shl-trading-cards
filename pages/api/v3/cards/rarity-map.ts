import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, Rarities } from '..'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { GET } from '@constants/http-methods'
import { cardsQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import methodNotAllowed from '../lib/methodNotAllowed'

const allowedMethods: string[] = [GET]
const cors = Cors({
  methods: allowedMethods,
})

export default async function rarityMap(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Rarities[]>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const leagueID = req.query.leagueID as string[]

    const leagues = Array.isArray(leagueID) ? leagueID : [leagueID]

    if (!leagueID) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: 'error', message: 'Missing leagueID' })
      return
    }
    const query = SQL`
            SELECT DISTINCT cards.card_rarity from cards where leagueID IN (`.append(
      leagues.join(',')
    ).append(SQL`) ORDER BY cards.card_rarity
        `)

    const queryResult = await cardsQuery<Rarities>(query)

    if ('error' in queryResult) {
      console.error(queryResult.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Database connection failed')
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
