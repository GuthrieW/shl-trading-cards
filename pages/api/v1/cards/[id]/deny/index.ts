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
  const { id } = request.query

  if (method === PATCH) {
    const results = await queryDatabase(`
      update \`admin_cards\`.\`cards\`
      set approved = 0
      and author_userid = null
      and image_url = null
      where cardid = ${id};`)
    response
      .status(StatusCodes.OK)
      .json({ result: 'approved card', denied_card_id: id })
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
