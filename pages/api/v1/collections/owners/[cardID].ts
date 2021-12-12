import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '@pages/api/database/database'
import { GET } from '@constants/index'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'

const allowedMethods = [GET]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method } = request
  const { cardID } = request.query

  if (method === GET) {
    /*
     * use: get all cards in a user's collection
     * called when: a lot of places
     */

    const results = await queryDatabase(`
      select userID
      from \`admin_cards\`.\`collection\`
      where cardID = ${cardID}
    `)

    response
      .status(StatusCodes.OK)
      .json({ result: 'get cards owners for cardID', cardID: cardID })
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
