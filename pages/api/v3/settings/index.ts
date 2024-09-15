import { GET } from '@constants/http-methods'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '..'
import { cardsQuery } from '@pages/api/database/database'
import SQL, { SQLStatement } from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'

const allowedMethods: string[] = [GET] as const
const cors = Cors({
  methods: allowedMethods,
})

export type SettingsData = {
  uid: number
  username: string
  subscription: number
}

export default async function settingsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<{ settings: SettingsData[]; total: number }>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const limit: string = (req.query.limit ?? 10) as string
    const offset: string = (req.query.offset ?? 0) as string
    const orderColumn: string = (req.query.orderColumn ?? 'username') as string
    const orderDirection: string = (req.query.order ?? 'ASC') as string

    const total = await cardsQuery<{
      count: number
    }>(SQL`
      SELECT count(*) as count
      FROM settings
      WHERE subscription > 0;
    `)

    const query: SQLStatement = SQL`
      SELECT u.uid, u.username, s.subscription 
      FROM admin_cards.settings s
      LEFT JOIN admin_mybb.mybb_users u ON s.userID = u.uid
      WHERE s.subscription > 0
    `

    if (orderColumn) {
      query.append(SQL` ORDER BY`)
      if (orderColumn === 'username') {
        query.append(SQL`  u.username`)
      }

      if (orderColumn === 'subscription') {
        query.append(SQL` s.subscription`)
      }

      orderDirection === 'ASC' ? query.append(SQL` ASC`) : query.append(` DESC`)
    }

    if (limit) {
      query.append(SQL` LIMIT ${parseInt(limit)}`)
    }

    if (offset) {
      query.append(SQL` OFFSET ${parseInt(offset)}`)
    }

    const queryResult = await cardsQuery<SettingsData>(query)

    if ('error' in queryResult || 'error' in total) {
      console.error(queryResult)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: { settings: queryResult, total: total[0].count },
    })
  }
}
