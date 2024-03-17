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
    try {
      const { cardID } = query as { cardID: string }
      const { image } = body as { image: string }

      const base64PngData: string = image.replace(/^data:image\/png;base64/, '')
      const pngBuffer = Buffer.from(base64PngData, 'base64')
      const webpBuffer: Buffer = await imageService.convertToWebp(pngBuffer)
      const imageFilename: string = `${uuid()}.webp`
      await imageService.saveImage(webpBuffer, imageFilename)

      const result = await queryDatabase(
        SQL`
        UPDATE `.append(getCardsDatabaseName()).append(SQL`.cards
        SET image_url=${imageFilename}
        WHERE cardID=${cardID};
      `)
      )

      response.status(StatusCodes.OK).json(result)
      return
    } catch (error) {
      console.log('error', error)
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
      return
    }
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
