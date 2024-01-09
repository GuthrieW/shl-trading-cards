import { NextApiRequest, NextApiResponse } from 'next'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { POST } from '@constants/http-methods'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import {
  getCardsDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import { TradeAsset } from '@pages/api/mutations/use-create-trade'
import checkBoom from '@pages/api/lib/checkBoom'

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

    const isTradingWithSelf: boolean = checkBoom(
      initiatorId !== recipientId,
      'Trading With Self',
      StatusCodes.BAD_REQUEST,
      response
    )
    if (isTradingWithSelf) return

    let tradeError: boolean = false
    await Promise.all(
      tradeAssets.map(async (asset: TradeAsset) => {
        const cardOwner = await queryDatabase(
          SQL`SELECT userID FROM `
            .append(getCardsDatabaseName())
            .append(`.collection WHERE ownedCardId=`)
            .append(asset.ownedCardId)
            .append(` LIMIT 1;`)
        )

        if (cardOwner[0].userID != asset.fromId) {
          tradeError = true
        }
      })
    )

    checkBoom(
      !tradeError,
      'Trade Contains Errors',
      StatusCodes.BAD_REQUEST,
      response
    )
    if (tradeError) return

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
