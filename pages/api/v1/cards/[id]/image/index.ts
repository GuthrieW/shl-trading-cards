import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '@pages/api/database/database'
import { PATCH } from '@constants/index'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'
import fs from 'fs'
import { pathToCardsForUpload } from '@constants/path-to-cards'
import { Card } from 'index.d'

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
  const { image } = request.body

  if (method === PATCH) {
    const cardData: Card[] = await queryDatabase(SQL`
      SELECT *
      FROM admin_cards.cards
      WHERE cardID=${id};
    `)

    const imageFilename = `${cardData[0].cardID}.png`
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
      WHERE cardID=${id};
    `)

    response.status(StatusCodes.OK).json(result)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
