import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, Rarities, SubType } from '..'
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
  res: NextApiResponse<ApiResponse<SubType[]>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const leagueID = req.query.leagueID as string[]
    const rarities = JSON.parse(req.query.rarities as string) as string[]

    if (!rarities) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: 'error', message: 'Missing rarities array' })
      return
    }

    if (rarities.length === 0) {
      res.status(StatusCodes.OK).json({
        status: 'success',
        payload: [],
      })
      return
    }

    const query = SQL`
    SELECT DISTINCT cards.sub_type
    FROM cards
    WHERE leagueID  IN (${leagueID})
        AND cards.card_rarity IN (${rarities})
        AND cards.sub_type IS NOT NULL
        AND cards.sub_type != ''
    `
    const queryResult = await cardsQuery<SubType>(query)

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
