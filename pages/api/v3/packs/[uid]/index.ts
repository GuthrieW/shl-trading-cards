import { NextApiRequest, NextApiResponse } from 'next'
import { cardsQuery } from '@pages/api/database/database'
import { GET } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'
import { ApiResponse, UserPacks } from '../..'

const allowedMethods = [GET]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserPacks[]>>
): Promise<void> => {
  await middleware(request, res, cors)
  const { method, query } = request

  // Get all of a user's unopened packs
  if (method === GET) {
    const { uid } = query
    const result = await cardsQuery<UserPacks>(
      SQL`
      SELECT packID,
        userID,
        packType,
        purchaseDate
      FROM packs_owned
      WHERE userID=${uid}
        AND opened=0;`
    )

    if ('error' in result) {
      console.error(result.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Database connection failed')
      return
    }
    if (result.length === 0) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({
          status: 'error',
          message: 'No opened packs found for this user',
        })
      return
    }
    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: result,
    })
    return
  }

  res.setHeader('Allowed', allowedMethods)
  res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
