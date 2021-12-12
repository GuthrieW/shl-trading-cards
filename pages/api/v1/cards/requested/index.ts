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
  const { uid } = request.query

  if (method === GET) {
    /*
     * use: get all requested cards
     * called when: card creators are selecting cards to create images for
     */

    // const results = await queryDatabase(``)
    response
      .status(StatusCodes.OK)
      .json({ result: 'get all requested cards', uid: uid })
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
