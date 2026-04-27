import { NextApiRequest, NextApiResponse } from 'next'
import { POST } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'
import assertBoom from '@pages/api/lib/assertBoom'
import { cardsQuery } from '@pages/api/database/database'
import { checkUserAuthorization } from '@pages/api/v3/lib/checkUserAuthorization'
import { rateLimit } from 'lib/rateLimit'

const allowedMethods = [POST]
const cors = Cors({
  methods: allowedMethods,
})

interface GenerateCards extends NextApiRequest {
  query: {
    cardID: string
  }
}

const handler = async (
  req: GenerateCards,
  res: NextApiResponse
): Promise<void> => {
  await middleware(req, res, cors)
  const { method } = req

  if (method === POST) {
    if (!(await checkUserAuthorization(req))) {
      res.status(StatusCodes.UNAUTHORIZED).end('Not authorized')
      return
    }

    try {
      const uid = req.body.userID as string

      const isMissingUserID: boolean = assertBoom(
        !!uid,
        res,
        'Missing userID',
        StatusCodes.BAD_REQUEST
      )
      if (isMissingUserID) return

      await cardsQuery(
        SQL`
          CALL generate_cards(${uid}); `
      )

      res.status(StatusCodes.OK).json({ purchaseSuccessful: true })
      return
    } catch (error) {
      res
        .status(500)
        .end(
          error instanceof Error ? error.message : 'Server connection failed'
        )
      return
    }
  }

  res.setHeader('Allowed', allowedMethods)
  res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default rateLimit(handler)
