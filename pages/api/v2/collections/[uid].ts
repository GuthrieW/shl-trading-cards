import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '@pages/api/database/database'
import {} from '@constants/index'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'

const allowedMethods = []
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method, query, body } = request

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
