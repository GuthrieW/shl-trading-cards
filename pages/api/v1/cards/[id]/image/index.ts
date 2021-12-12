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
  const { cardID } = request.query
  const { imageFileName } = request.body

/* need to add UID to the variable list */   

  if (method === PATCH) {
    const results = await queryDatabase(`
      update \`admin_cards\`.\`cards\`
      set image_url = ${imageFileName},
      author_userID = ${uid}
      where cardid = ${cardID};`)
    response
      .status(StatusCodes.OK)
      .json({ result: 'added image to card', image: imageFileName, cardID: cardID })
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
