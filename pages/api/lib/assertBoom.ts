import { StatusCodes } from 'http-status-codes'
import { NextApiResponse } from 'next'

export default function assertBoom(
  predicate: boolean | ((...args: any[]) => boolean),
  response: NextApiResponse,
  errorMessage?: string,
  errorCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR
): boolean {
  if (!predicate) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('boom', errorMessage)
    }

    response.status(errorCode).json({ error: { errorMessage, errorCode } })
    throw new Error()
  }

  return false
}
