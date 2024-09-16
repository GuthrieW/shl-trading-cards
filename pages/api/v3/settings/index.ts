import { GET } from '@constants/http-methods'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, ListResponse, ListTotal } from '..'
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
  res: NextApiResponse<ApiResponse<ListResponse<SettingsData>>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const limit: string = (req.query.limit ?? 10) as string
    const offset: string = (req.query.offset ?? 0) as string
    const sortColumn: string = (req.query.sortColumn ?? 'username') as string
    const sortDirection: string = (req.query.sortDirection ?? 'ASC') as string

    const count = await cardsQuery<ListTotal>(SQL`
      SELECT count(*) as total
      FROM settings
      WHERE subscription > 0;
    `)

    const query: SQLStatement = SQL`
      SELECT u.uid, u.username, s.subscription 
      FROM admin_cards.settings s
      LEFT JOIN admin_mybb.mybb_users u ON s.userID = u.uid
      WHERE s.subscription > 0
    `

    if (sortColumn) {
      query.append(SQL` ORDER BY`)
      if (sortColumn === 'username') {
        query.append(SQL` u.username`)
      }

      if (sortColumn === 'subscription') {
        query.append(SQL` s.subscription`)
      }

      sortDirection === 'ASC' ? query.append(SQL` ASC`) : query.append(` DESC`)
    }

    if (limit) {
      query.append(SQL` LIMIT ${parseInt(limit)}`)
    }

    if (offset) {
      query.append(SQL` OFFSET ${parseInt(offset)}`)
    }

    const queryResult = await cardsQuery<SettingsData>(query)

    if ('error' in count || 'error' in queryResult) {
      console.error(queryResult)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: { rows: queryResult, total: count[0].total },
    })
  }
}
