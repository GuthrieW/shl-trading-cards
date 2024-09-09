import { StatusCodes } from 'http-status-codes'
import { NextApiResponse } from 'next'

export default function serverConnectionFailed<T>(
  res: NextApiResponse,
  queryResult: T[]
): boolean {
  if ('error' in queryResult) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .end('Server connection failed')
    return true
  }

  return false
}
