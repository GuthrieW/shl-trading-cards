import { NextApiRequest, NextApiResponse } from 'next'
import {
  getCardsDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import { POST } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'
import { imageService } from 'lib/imageService'
import pathToCards from '@constants/path-to-cards'
import axios from 'axios'
import { OutputInfo } from 'sharp'

const allowedMethods = [POST]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method } = request

  if (method === POST) {
    const cardsToFix: Card[] = await queryDatabase<Card>(
      SQL` SELECT * FROM `
        .append(getCardsDatabaseName())
        .append(
          SQL`.cards WHERE image_url LIKE "%.png" ORDER BY cardID LIMIT 1;`
        )
    )

    const result: OutputInfo[] = await Promise.all(
      await cardsToFix.map(async (card: Card) => {
        const imageResponse = await axios({
          url: `${pathToCards}${card.image_url}`,
          responseType: 'arraybuffer',
        })

        const webp: Buffer = await imageService.convertToWebp(
          imageResponse.data
        )
        const filename: string = await imageService.generateFilename()
        return await imageService.saveImage(webp, filename)
      })
    )

    response.status(StatusCodes.OK).json({ updatedImages: result })
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
