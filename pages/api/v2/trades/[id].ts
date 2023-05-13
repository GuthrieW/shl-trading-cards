import { NextApiRequest, NextApiResponse } from 'next'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { GET, POST } from '@constants/index'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import { queryDatabase } from '@pages/api/database/database'
import { TradeAsset } from '@pages/api/mutations/use-create-trade'

const allowedMethods = [GET, POST]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method, query, body } = request

  if (method === GET) {
    const { id } = query
    const result = await queryDatabase(
      SQL`CALL get_trade_details_by_tradeID(${id});`
    )
    response.status(StatusCodes.OK).json(result)
    return
  }

  if (method === POST) {
    const { initiatorId, recipientId, tradeAssets } = body
    const createTradeResult = await queryDatabase(
      SQL`call create_trade(${initiatorId},${recipientId})`
    )
    const tradeAssetsResults = await Promise.all(
      tradeAssets.map(async (asset: TradeAsset) => {
        return await queryDatabase(
          SQL`call add_trade_asset(${createTradeResult.id}, ${asset.ownedCardId}, ${asset.toId}, ${asset.fromId});`
        )
      })
    )

    response
      .status(StatusCodes.OK)
      .json({ trade: createTradeResult, assets: tradeAssetsResults })
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
