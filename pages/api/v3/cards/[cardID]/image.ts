import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '../..'
import middleware from '@pages/api/database/middleware'
import { DELETE, POST } from '@constants/http-methods'
import Cors from 'cors'
import { StatusCodes } from 'http-status-codes'
import { cardsQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'
import methodNotAllowed from '../../lib/methodNotAllowed'
import { imageService } from 'services/imageService'

const allowedMethods: string[] = [DELETE, POST] as const
const cors = Cors({
  methods: allowedMethods,
})

export default async function imageEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<null | string>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === DELETE) {
    const cardID = req.query.cardID as string

    if (!cardID) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Please provide a cardID in your request',
      })
      return
    }

    const count = await cardsQuery<{ total: number }>(SQL`
      SELECT count(*) as total
      FROM cards
      WHERE cardID=${cardID}
    `)

    if ('error' in count) {
      console.error(count)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    if (count[0].total > 1) {
      console.error('Multiple cards with same id')
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Multiple cards with same id')
      return
    }

    if (count[0].total === 0) {
      console.error('Card not found')
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end('Card not found')
      return
    }

    const queryResult = await cardsQuery(SQL`
      UPDATE cards
      SET image_url = NULL,
        approved = 0,
        author_paid = 0,
        pullable = 0
      WHERE cardID=${parseInt(cardID)}
    `)

    if ('error' in queryResult) {
      console.error(queryResult)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: null,
    })
    return
  }

  if (req.method === POST) {
    const cardID = req.query.cardID as string
    const image = req.body.image as string

    if (!cardID || !image) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Please provide a cardID and an image in your request',
      })
      return
    }

    const count = await cardsQuery<{ total: number }>(SQL`
      SELECT count(*) as total
      FROM cards
      WHERE cardID=${cardID}
    `)

    if ('error' in count) {
      console.error(count)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    if (count[0].total > 1) {
      console.error('Multiple cards with same id')
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Multiple cards with same id')
      return
    }

    if (count[0].total === 0) {
      console.error('Card not found')
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end('Card not found')
      return
    }

    const filename: string = imageService.generateFilename()
    const decodedImage: string = imageService.base64ToString(image)
    const { success, error } = imageService.saveImage(decodedImage, filename)
    if (!success) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error,
      })
      return
    }

    const result = await cardsQuery(SQL`
      UPDATE cards
      SET image_url=${filename}
      WHERE cardID=${cardID}
    `)

    if ('error' in result) {
      console.error(result)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: null,
    })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
