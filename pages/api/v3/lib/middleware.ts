import { DELETE, GET, PATCH, POST, PUT } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'

type MiddlewareOptions = {
  allowedMethods: string[]
}

export default function middleware(
  request: NextApiRequest,
  response: NextApiResponse,
  options: MiddlewareOptions
) {
  if (!options.allowedMethods.includes(request.method)) {
    response
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .end(`Method ${request.method} Not Allowed`)
    return false
  }
}
