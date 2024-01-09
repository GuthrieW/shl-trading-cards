import { StatusCodes } from 'http-status-codes'
import { NextApiResponse } from 'next'

export default function checkBoom(
  predicate: boolean | ((...args: any[]) => boolean),
  errorMessage: string,
  errorCode: StatusCodes,
  response: NextApiResponse
): boolean {
  if (!predicate) {
    if (process.env.APP_ENV !== 'production') {
      console.log('boom', errorMessage)
    }

    response.status(errorCode).json({ error: errorMessage })
    return true
  }

  return false
}
