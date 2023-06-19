import { NextApiRequest, NextApiResponse } from 'next'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { GET, POST } from '@constants/index'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import { queryDatabase } from '@pages/api/database/database'

const allowedMethods = [GET]
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

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
