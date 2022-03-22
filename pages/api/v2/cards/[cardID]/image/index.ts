import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '@pages/api/database/database'
import { PATCH } from '@constants/index'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'
import fs from 'fs'
import { pathToCardsForUpload } from '@constants/path-to-cards'

const allowedMethods = [PATCH]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method, query, body } = request

  if (method === PATCH) {
    const { cardID } = query
    const { image } = body

    const imageFilename = `${cardID}.png`
    const base64Data = image.replace(/^data:image\/png;base64,/, '')

    try {
      const imagePage = `${pathToCardsForUpload}${imageFilename}`
      fs.writeFileSync(imagePage, base64Data, 'base64')
    } catch (error) {
      console.log('error', error)
    }

    const result = await queryDatabase(SQL`
      UPDATE admin_cards.cards
      SET image_url=${imageFilename}
      WHERE cardID=${cardID};
    `)

    response.status(StatusCodes.OK).json(result)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
