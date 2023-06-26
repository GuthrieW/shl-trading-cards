import { POST } from '@constants/http-methods'
import middleware from '@pages/api/database/middleware'
import { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { queryDatabase } from '@pages/api/database/database'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'

const allowedMethods = [POST]
const cors = Cors({
  method: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method, query } = request

  if (method === POST) {
    const { id } = query
    const result = await queryDatabase(SQL`call decline_trade(${id});`)
    response.status(StatusCodes.OK).json(result)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
