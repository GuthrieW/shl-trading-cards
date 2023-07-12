import { NextApiRequest, NextApiResponse } from 'next'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { POST } from '@constants/http-methods'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import { queryDatabase } from '@pages/api/database/database'
import { TradeAsset } from '@pages/api/mutations/use-create-trade'

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
    const { initiatorId, recipientId, tradeAssets } = body
    if (initiatorId === recipientId) {
      response
        .status(StatusCodes.BAD_REQUEST)
        .send('You cannot trade with yourself')
      return
    }

    const createTradeResult = await queryDatabase(
      SQL`call create_trade(${initiatorId},${recipientId})`
    )
    const newTrade = createTradeResult[0][0]
    const tradeAssetsResults = await Promise.all(
      tradeAssets.map(async (asset: TradeAsset) => {
        return await queryDatabase(
          SQL`call add_trade_asset(${newTrade.tradeID}, ${asset.ownedCardId}, ${asset.toId}, ${asset.fromId});`
        )
      })
    )

    response
      .status(StatusCodes.OK)
      .json({ trade: newTrade, assets: tradeAssetsResults })
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
