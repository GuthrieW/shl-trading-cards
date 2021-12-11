import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '@pages/api/database/database'
import { DELETE, PATCH } from '@constants/index'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'

const allowedMethods = [DELETE, PATCH]
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

  if (method === DELETE) {
    /*
     * use: send a card back to the start of the request queue
     * called when: a member of the trading card team clicks the deny button on the approval page
     */

    // const results = await queryDatabase(``)
    response
      .status(StatusCodes.OK)
      .json({ result: 'deleted card', deleted_card_id: uid })
  }

  if (method === PATCH) {
    /*
     * use: set a card's approval status to true
     * called when: a member of the trading card team clicks the deny button on the approval page
     */

    // const results = await queryDatabase(``)
    response
      .status(StatusCodes.OK)
      .json({ result: 'approved card', approved_card_id: uid })
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
