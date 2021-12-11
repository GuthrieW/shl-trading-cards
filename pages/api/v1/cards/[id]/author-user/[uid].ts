import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '@pages/api/database/database'
import { PATCH } from '@constants/index'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'

const allowedMethods = [PATCH]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method } = request
  const { uid } = request.query

  if (method === PATCH) {
    /*
     * use: update author_userID
     * called when: a card creator claims a card that they will be making the picture for
     */

    // const results = await queryDatabase(``)
    response
      .status(StatusCodes.OK)
      .json({ result: 'author added to card', author_userID: uid })
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
