import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, Rarities } from '..'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { GET } from '@constants/http-methods'
import { cardsQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import methodNotAllowed from '../lib/methodNotAllowed'
import { parseQueryArray } from '@utils/parse-query-array'
import { rarityMap } from '@constants/rarity-map'

const allowedMethods: string[] = [GET]
const cors = Cors({
  methods: allowedMethods,
})

export default async function getRarityMap(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Rarities[]>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const leagues = parseQueryArray(req.query.leagueID)

    if (!leagues) {
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

    const rarityOrder = Object.values(rarityMap).map((r) => r.label.toString())
    console.log(rarityOrder)
    const sortedResult = queryResult.sort(
      (a, b) =>
        rarityOrder.indexOf(a.card_rarity) - rarityOrder.indexOf(b.card_rarity)
    )
    console.log('sortedResult', sortedResult)

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: sortedResult,
    })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
