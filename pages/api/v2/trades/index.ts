import { NextApiRequest, NextApiResponse } from 'next'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { POST } from '@constants/index'
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

  console.log('method', method)
  console.log('body', body)

  if (method === POST) {
    console.log('inside of POST')
    const { initiatorId, recipientId, tradeAssets } = body
    console.log('body', body)
    const createTradeResult = await queryDatabase(
      SQL`call create_trade(${initiatorId},${recipientId})`
    )
    const newTrade = createTradeResult[0][0]
    console.log('trade created', createTradeResult)
    const tradeAssetsResults = await Promise.all(
      tradeAssets.map(async (asset: TradeAsset) => {
        return await queryDatabase(
          SQL`call add_trade_asset(${newTrade.tradeID}, ${asset.ownedCardId}, ${asset.toId}, ${asset.fromId});`
        )
      })
    )

    console.log('trade assets added', tradeAssetsResults)

    response
      .status(StatusCodes.OK)
      .json({ trade: newTrade, assets: tradeAssetsResults })
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
