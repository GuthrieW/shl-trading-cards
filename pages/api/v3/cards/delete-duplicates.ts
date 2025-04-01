import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '..'
import middleware from '@pages/api/database/middleware'
import { DELETE } from '@constants/http-methods'
import Cors from 'cors'
import methodNotAllowed from '../lib/methodNotAllowed'
import { StatusCodes } from 'http-status-codes'

const allowedMethods: string[] = [DELETE]
const cors = Cors({
  methods: allowedMethods,
})

export default async function deleteDuplicatesEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<void>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === DELETE) {
    res.status(StatusCodes.NOT_IMPLEMENTED).end('Endpoint not implemented')
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
