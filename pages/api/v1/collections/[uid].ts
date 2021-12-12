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
   const results = await queryDatabase(`
    select
      col.cardID,
      col.quantity,
      c.image_url
    from \`admin_cards\`.\`collection\` col
      left join \`admin_cards\`.\`cards\` c
        on col.cardID = c.cardID
    where col.userID = ${uid} `)
    response
      .status(StatusCodes.OK)
      .json({ result: 'get user collection', userID: uid })
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
