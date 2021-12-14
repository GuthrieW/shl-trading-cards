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
  const { body, method, uid } = request
  const { cardID } = request.body
  if (method === POST) {
    const results = await queryDatabase(`
    insert into admin_cards.collection
    (userid, cardid, quantity, update_date)
    values
    (${uid}, ${cardID}, 1, CURRENT_TIMESTAMP)
    on duplicate key update quantity = (quantity + 1)`)
    response
      .status(StatusCodes.OK)
      .json({ result: 'pack purchased', pack_purchase_data: body })
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
