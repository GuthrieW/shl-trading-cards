import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '../..'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { GET, POST } from '@constants/http-methods'
import methodNotAllowed from '../../lib/methodNotAllowed'
import { cardsQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import { checkUserAuthorization } from '../../lib/checkUserAuthorization'
import { rateLimit } from 'lib/rateLimit'

const allowedMethods = [POST]
const cors = Cors({
  methods: allowedMethods,
})

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) => {
  await middleware(req, res, cors)

  const { uid } = req.query

  if (req.method === POST) {
    if (!(await checkUserAuthorization(req))) {
      res.status(StatusCodes.UNAUTHORIZED).end('Not authorized')
      return
    }
    const { subscription } = req.body

    if (subscription === undefined) {
      console.error('Missing subscription')
      res
        .status(StatusCodes.BAD_REQUEST)
        .end('Please provide a subscription amount in your request')
      return
    }

    if (subscription < 0 || subscription > 3) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .end('Subscription must be between 0 and 3')
      return
    }

    await cardsQuery(SQL`
      INSERT INTO settings
        (userID, subscription)
      VALUES
        (${uid}, ${subscription})
      ON DUPLICATE KEY UPDATE subscription=${subscription};
    `)

    res
      .status(StatusCodes.OK)
      .json({ status: 'success', payload: { subscription } })
  } else {
    methodNotAllowed(req, res, allowedMethods)
  }
}

export default rateLimit(handler)
