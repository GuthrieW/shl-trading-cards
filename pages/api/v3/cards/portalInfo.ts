import { NextApiRequest, NextApiResponse } from 'next'
import { GET } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'
import { ApiResponse, PortalInfo } from '..'
import methodNotAllowed from '../lib/methodNotAllowed'
import { cardsQuery } from '@pages/api/database/database'

const allowedMethods = [GET]
const cors = Cors({
  methods: allowedMethods,
})

export default async function cardInfo(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PortalInfo[]>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const playerID = req.query.playerID as string
    const leagueID = req.query.leagueID as string

    console.log(playerID)

    if (!playerID || !leagueID || playerID === '1') {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Please provide a cardID or leagueID in your request',
      })
      return
    }

    const queryResult = await cardsQuery(SQL`
     CALL get_card_maker_info(${leagueID}, ${playerID})
    `)

    if ('error' in queryResult) {
      console.error(queryResult)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    res
      .status(StatusCodes.OK)
      .json({ status: 'success', payload: queryResult[0] as PortalInfo[] })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
