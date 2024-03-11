import { NextApiRequest, NextApiResponse } from 'next'
import {
  getCardsDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import { PATCH } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'
import { v4 as uuid } from 'uuid'
import { imageService } from 'lib/imageService'

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
    const { cardID } = query as { cardID: string }
    const { image } = body as { image: string }

    const imageFilename: string = `${uuid()}.webp`
    const base64PngData: string = image.replace(/^data:image\/png;base64,/, '')
    const webpBuffer: Buffer = await imageService.convertToWebp(base64PngData)
    try {
      await imageService.saveImage(webpBuffer, imageFilename)
    } catch (error) {
      console.log('error', error)
    }

    const result = await queryDatabase(
      SQL`
      UPDATE `.append(getCardsDatabaseName()).append(SQL`.cards
      SET image_url=${imageFilename}
      WHERE cardID=${cardID};
    `)
    )

    response.status(StatusCodes.OK).json(result)
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
