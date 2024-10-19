import { StatusCodes } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'

export default function methodNotAllowed(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedMethods: string[]
): void {
  res.setHeader('Allowed', allowedMethods)
  res
    .status(StatusCodes.METHOD_NOT_ALLOWED)
    .end(`Method ${req.method} Not Allowed`)
}
