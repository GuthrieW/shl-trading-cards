import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '@pages/api/database/database'
import { POST } from '@constants/index'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'

const allowedMethods = [POST]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { body, method } = request

  if (method === POST) {
    /*
     * use: insert a card into the database that will be in the table of cards that are available to be claimed
     * called when: when a member of the trading card team submits a card request
     */

    // const results = await queryDatabase(``)
    response
      .status(StatusCodes.OK)
      .json({ result: 'card request created', card: body })
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
