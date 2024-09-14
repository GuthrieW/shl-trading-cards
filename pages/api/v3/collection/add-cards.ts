import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '..'
import middleware from '@pages/api/database/middleware'
import { POST } from '@constants/http-methods'
import Cors from 'cors'
import methodNotAllowed from '../lib/methodNotAllowed'

const allowedMethods: string[] = [POST]
const cors = Cors({
  methods: allowedMethods,
})

export default async function addCardsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<void>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === POST) {
  }

  methodNotAllowed(req, res, allowedMethods)
}
