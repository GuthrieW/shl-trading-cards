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
import checkBoom from '@pages/api/lib/checkBoom'

const allowedMethods = [POST]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method, query } = request

  if (method === POST) {
    const { issueruid, uid, packType } = query

    const missingRequestData: boolean = checkBoom(
      !!issueruid || !!uid || !!packType,
      'Missing Request Data',
      StatusCodes.BAD_REQUEST,
      response
    )
    if (missingRequestData) return

    await queryDatabase(
      SQL`
      INSERT INTO `.append(getCardsDatabaseName()).append(SQL`.packs_owned
        (userID, packType, source, purchaseDate)
      VALUES
        (${uid}, ${packType}, "Admin ${issueruid}", NOW() - INTERVAL 1 DAY);
    `)
    )

    response.status(StatusCodes.OK).json({ purchaseSuccessful: true })
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
