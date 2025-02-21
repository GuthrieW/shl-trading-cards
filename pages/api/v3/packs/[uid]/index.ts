import { NextApiRequest, NextApiResponse } from 'next'
import { cardsQuery } from '@pages/api/database/database'
import { GET } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL, { SQLStatement } from 'sql-template-strings'
import { ApiResponse, UserPacks } from '../..'
import { rateLimit } from 'lib/rateLimit'

const allowedMethods = [GET]
const cors = Cors({
  methods: allowedMethods,
})

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserPacks[]>>
): Promise<void> => {
  await middleware(req, res, cors)
  const { method } = req

  if (method === GET) {
    const uid = req.query.uid as string
    const packType = req.query.packType as string

    const query: SQLStatement = SQL`
        SELECT packID,
        userID,
        packType,
        purchaseDate
      FROM packs_owned
      WHERE userID=${uid}`

    if (packType) {
      query.append(SQL` AND packType = ${packType}`)
    }
    query.append(SQL` AND opened=0;`)

    const queryResult = await cardsQuery<UserPacks>(query)

    if ('error' in queryResult) {
      console.error(queryResult.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Database connection failed')
      return
    }
    if (queryResult.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        status: 'error',
        message: 'No opened packs found for this user',
      })
      return
    }
    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: queryResult,
    })
    return
  }

  res.setHeader('Allowed', allowedMethods)
  res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default rateLimit(handler)
