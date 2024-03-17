import { NextApiRequest, NextApiResponse } from 'next'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { GET } from '@constants/http-methods'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import { queryDatabase } from '@pages/api/database/database'
import TradeGrid from '@components/grids/trade-grid'

const allowedMethods = [GET]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method, query } = request

  if (method === GET) {
    const { uid } = query
    const trades = await queryDatabase<Trade[]>(
      SQL`CALL get_trades_by_user(${uid});`
    )
    const pending: Trade[] = trades[0].filter(
      (trade: Trade) => trade.trade_status === 'PENDING'
    )
    response.status(StatusCodes.OK).json({ pending: pending.length })
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
