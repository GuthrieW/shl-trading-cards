import { StatusCodes } from 'http-status-codes'
import { NextApiResponse } from 'next'

export default function assertTrue(
  predicate: boolean | ((...args: any[]) => boolean),
  errorMessage: string,
  errorCode: StatusCodes,
  response: NextApiResponse
): boolean {
  if (!predicate) {
    if (process.env.APP_ENV === 'production') {
      console.log(errorMessage)
    }

    response.status(errorCode).json({ error: errorMessage })
    return false
  }

  return true
}
