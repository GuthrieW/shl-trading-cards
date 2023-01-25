import { NextApiRequest, NextApiResponse } from 'next'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { GET } from '@constants/index'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import {
  getCardsDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import groupBy from 'lodash/groupBy'
import { Dictionary } from 'lodash'

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

    response.status(StatusCodes.OK).json(result)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index

const result: Trade[] = [
  {
    tradeID: 1,
    tradeAssetID: 1,
    fromID: 2856,
    toID: 2554,
    cardID: 3627,
    trade_status: 'pending',
    create_date: new Date(),
    update_date: new Date(),
  },
  {
    tradeID: 1,
    tradeAssetID: 2,
    fromID: 2856,
    toID: 2554,
    cardID: 4815,
    trade_status: 'pending',
    create_date: new Date(),
    update_date: new Date(),
  },
  {
    tradeID: 1,
    tradeAssetID: 3,
    fromID: 2856,
    toID: 2554,
    cardID: 1391,
    trade_status: 'pending',
    create_date: new Date(),
    update_date: new Date(),
  },
  {
    tradeID: 1,
    tradeAssetID: 4,
    fromID: 2554,
    toID: 2856,
    cardID: 3679,
    trade_status: 'pending',
    create_date: new Date(),
    update_date: new Date(),
  },
  {
    tradeID: 1,
    tradeAssetID: 5,
    fromID: 2554,
    toID: 2856,
    cardID: 3259,
    trade_status: 'pending',
    create_date: new Date(),
    update_date: new Date(),
  },
  {
    tradeID: 1,
    tradeAssetID: 6,
    fromID: 2554,
    toID: 2856,
    cardID: 3051,
    trade_status: 'pending',
    create_date: new Date(),
    update_date: new Date(),
  },
  {
    tradeID: 2,
    tradeAssetID: 1,
    fromID: 2856,
    toID: 2554,
    cardID: 2845,
    trade_status: 'pending',
    create_date: new Date(),
    update_date: new Date(),
  },
  {
    tradeID: 2,
    tradeAssetID: 2,
    fromID: 2856,
    toID: 2554,
    cardID: 2327,
    trade_status: 'pending',
    create_date: new Date(),
    update_date: new Date(),
  },
  {
    tradeID: 2,
    tradeAssetID: 3,
    fromID: 2856,
    toID: 2554,
    cardID: 2981,
    trade_status: 'pending',
    create_date: new Date(),
    update_date: new Date(),
  },
  {
    tradeID: 2,
    tradeAssetID: 4,
    fromID: 2554,
    toID: 2856,
    cardID: 2634,
    trade_status: 'pending',
    create_date: new Date(),
    update_date: new Date(),
  },
]
