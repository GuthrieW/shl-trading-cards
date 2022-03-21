import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '@pages/api/database/database'
import { POST } from '@constants/index'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'

const allowedMethods = [POST]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method, query, body } = request
  const { uid } = query
  const { purchaseAmount } = body

  if (method === POST) {
    const result = await queryDatabase(SQL`
      INSERT INTO admin_cards.packs_owned
        (userID, base_quantity, subscribed)
      VALUES 
        (${uid}, ${purchaseAmount}, 0)
      ON DUPLICATE KEY UPDATE base_quantity=(base_quantity + ${purchaseAmount});
    `)

    response.status(StatusCodes.OK).json(result)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
