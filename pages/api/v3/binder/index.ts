import { NextApiRequest, NextApiResponse } from 'next'
import { cardsQuery } from '@pages/api/database/database'
import { GET } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'
import { ApiResponse, binders } from '..'

const allowedMethods = [GET]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<binders[]>>
): Promise<void> => {
  await middleware(req, res, cors)
  const bid = req.query.bid as string

  if (req.method === GET) {
    if (req.method !== 'GET') {
      res.status(405).end(`Method ${req.method} Not Allowed`)
      return
    }
    const binderQuery = SQL`
      SELECT 
    b.binderID, 
    b.uid AS userID, 
    b.binder_name, 
    b.binder_desc, 
    u.username 
FROM 
    binders b
JOIN 
    user_info u ON b.uid = u.uid`
    if (bid) {
      binderQuery.append(SQL` WHERE b.binderID=${bid} `)
    }

    const result = await cardsQuery<binders>(binderQuery)

    if ('error' in result) {
      console.error(result.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Database connection failed')
      return
    }
    if (result.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        status: 'error',
        message: 'No binder found',
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
